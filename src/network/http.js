export default class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetch(url, options) {
    const res = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    let data;
    // 서버로 부터 응답을 받은 데이터의 헤더(Content-Type)부분을 체크함.
    // 만약 json형태로 데이터를 반환을 하면. 아래의 코드를 실행하면서 에러가 발생하면 에러를 띄운다.
    // 하지만 json형식이 아니면 오류를 띄우지 않고, res.json 호출을 생략한다., data변수를 초기화 하지 않는다.
    if (res.headers.get('Content-Type')?.includes('application/json')) {
      try {
        data = await res.json();
      } catch (error) {
        console.error(error);
      }
    }

    if (res.status > 299 || res.status < 200) {
      const message =
        data && data.message ? data.message : 'Something went wrong! 🤪';
      throw new Error(message);
    }
    return data;
  }
}
