import { NextRequest, NextResponse } from "next/server";

// Firebase Storage에서 이미지를 프록시하는 API
export async function GET(request: NextRequest) {
  try {
    // URL에서 이미지 URL 가져오기
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "이미지 URL이 제공되지 않았습니다" },
        { status: 400 }
      );
    }

    console.log("프록시 요청 이미지 URL:", imageUrl);

    // Firebase Storage에서 이미지 가져오기
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`이미지를 가져올 수 없습니다: ${response.status}`);
    }

    // 이미지 데이터 가져오기
    const imageBuffer = await response.arrayBuffer();

    // 응답 헤더 설정
    const headers = new Headers();
    headers.set(
      "Content-Type",
      response.headers.get("Content-Type") || "image/jpeg"
    );
    headers.set("Cache-Control", "public, max-age=31536000");
    headers.set("Access-Control-Allow-Origin", "*");

    // 이미지 반환
    return new NextResponse(imageBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("이미지 프록시 오류:", error);
    return NextResponse.json(
      {
        error: `이미지 프록시 오류: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
