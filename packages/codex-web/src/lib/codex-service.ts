import { spawn, ChildProcess } from "child_process";
import path from "path";

export interface CodexConfig {
  model?: string;
  provider?: string;
  approvalMode?: "suggest" | "auto-edit" | "full-auto";
  quiet?: boolean;
  image?: string[];
}

export interface CodexRequest {
  prompt: string;
  config: CodexConfig;
}

export interface CodexResponse {
  content: string;
  success: boolean;
  error?: string;
}

export class CodexService {
  private codexPath: string;

  constructor() {
    // codex-cli의 빌드된 실행 파일 경로
    this.codexPath = path.resolve(
      process.cwd(),
      "../../codex-cli/bin/codex.js",
    );
  }

  async executeCodex(request: CodexRequest): Promise<CodexResponse> {
    try {
      const { prompt, config } = request;
      const args = this.buildArgs(prompt, config);

      return new Promise((resolve, reject) => {
        const codexProcess: ChildProcess = spawn(
          "node",
          [this.codexPath, ...args],
          {
            stdio: ["pipe", "pipe", "pipe"],
            cwd: process.cwd(),
            env: {
              ...process.env,
              // OpenAI API 키가 환경변수에서 로드되도록 함
              OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            },
          },
        );

        let stdout = "";
        let stderr = "";

        codexProcess.stdout?.on("data", (data) => {
          stdout += data.toString();
        });

        codexProcess.stderr?.on("data", (data) => {
          stderr += data.toString();
        });

        codexProcess.on("close", (code) => {
          if (code === 0) {
            resolve({
              content: stdout,
              success: true,
            });
          } else {
            resolve({
              content: stderr || `프로세스가 코드 ${code}로 종료되었습니다`,
              success: false,
              error: stderr,
            });
          }
        });

        codexProcess.on("error", (error) => {
          reject({
            content: `Codex 실행 오류: ${error.message}`,
            success: false,
            error: error.message,
          });
        });

        // 프롬프트를 stdin으로 전달 (인터랙티브 모드인 경우)
        if (codexProcess.stdin && !config.quiet) {
          codexProcess.stdin.write(prompt + "\n");
          codexProcess.stdin.end();
        }
      });
    } catch (error) {
      return {
        content: `Codex 서비스 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      };
    }
  }

  private buildArgs(prompt: string, config: CodexConfig): string[] {
    const args: string[] = [];

    // 모델 설정
    if (config.model) {
      args.push("-m", config.model);
    }

    // 제공자 설정
    if (config.provider) {
      args.push("-p", config.provider);
    }

    // 승인 모드 설정
    if (config.approvalMode) {
      args.push("-a", config.approvalMode);
    }

    // Quiet 모드 (비인터랙티브)
    if (config.quiet) {
      args.push("-q");
    }

    // 이미지 파일들
    if (config.image && config.image.length > 0) {
      config.image.forEach((imagePath) => {
        args.push("-i", imagePath);
      });
    }

    // 프롬프트를 마지막 인자로 추가
    if (config.quiet) {
      args.push(prompt);
    }

    return args;
  }

  async validateCodexInstallation(): Promise<boolean> {
    try {
      return new Promise((resolve) => {
        const testProcess = spawn("node", [this.codexPath, "--help"], {
          stdio: ["pipe", "pipe", "pipe"],
        });

        testProcess.on("close", (code) => {
          resolve(code === 0);
        });

        testProcess.on("error", () => {
          resolve(false);
        });
      });
    } catch {
      return false;
    }
  }
}

// 싱글톤 인스턴스
export const codexService = new CodexService();
