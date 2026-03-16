from flask import Flask, render_template, request
import requests

app = Flask(__name__)

# 카카오 도서 검색 API 키
API_KEY = "eece2837324ea6a6c7b623f4876179e9"

@app.route('/')
def index():
    # 검색어 기본값 '추리'
    query = request.args.get('q', '추리')
    
    url = "https://dapi.kakao.com/v3/search/book"
    params = {"query": query, "sort": "accuracy", "size": 20}
    headers = {"Authorization": f"KakaoAK {API_KEY}"}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        books = response.json().get('documents', []) if response.status_code == 200 else []
    except:
        books = []
        
    return render_template('index.html', books=books, query=query)

@app.route('/detail')
def detail():
    # 1. 주소창(?title=...)에 실려온 데이터를 하나씩 뽑아냅니다.
    book_info = {
        'title': request.args.get('title', '정보 없음'),
        'author': request.args.get('author', '저자 미상'),
        'publisher': request.args.get('publisher', '출판사 없음'),
        'price': request.args.get('price', '0'),
        'thumbnail': request.args.get('thumb', ''),
        'contents': request.args.get('contents', '상세 내용이 없습니다.')
    }
    # 2. detail.html 파일에 'book'이라는 이름으로 이 바구니를 전달합니다.
    return render_template('detail.html', book=book_info)
if __name__ == '__main__':
    app.run(debug=True, port=5000)