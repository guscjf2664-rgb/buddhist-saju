export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { saju, g, lackOh, wish, gender, year, hour } = req.body;

  const prompt = `당신은 30년 경력의 불교 명리학 전문가입니다. 아래 사주를 바탕으로 불교 세계관으로 심층 풀이해주세요.

사주팔자: ${saju}
일간 수호불: ${g}
부족한 오행: ${lackOh}
성별: ${gender}, 생년: ${year}년생
태어난 시: ${hour}
이번달 바라는 것: ${wish}

다음 형식으로 따뜻하고 구체적으로 작성해주세요 (600자 내외):

【전생 업보】
${year}년 ${hour}시에 태어난 분의 전생 인연과 이번 생의 과제를 불교적으로 풀이 (3~4문장)

【이번 달 대운 흐름】
현재 오행 흐름과 ${wish} 관련 이달의 운세 구체적으로 풀이 (3~4문장)

【맞춤 기도 코스】
수호불 ${g}께 드리는 구체적인 기도 방법과 절차 (3~4문장)

주의: 경전 직접 인용 금지. 따뜻하고 신뢰감 있는 말투로 작성.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '풀이 생성에 실패했습니다.';
    res.status(200).json({ result: text });
  } catch (err) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
