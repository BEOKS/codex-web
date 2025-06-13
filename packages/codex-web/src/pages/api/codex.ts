import { NextApiRequest, NextApiResponse } from "next";
import { codexService } from "@/lib/codex-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, config } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("Codex 요청 받음:", { prompt, config });

    // 실제 codex-cli 기능을 호출합니다
    const response = await codexService.executeCodex({
      prompt,
      config: {
        ...config,
        quiet: true, // 웹 인터페이스에서는 quiet 모드 사용
      },
    });

    if (response.success) {
      res.status(200).json({
        success: true,
        content: response.content,
      });
    } else {
      res.status(400).json({
        success: false,
        error: response.error || "알 수 없는 오류가 발생했습니다",
      });
    }
  } catch (error) {
    console.error("Codex 처리 오류:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "서버 오류가 발생했습니다",
    });
  }
}
