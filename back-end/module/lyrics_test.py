# 곡을 아티스트명-곡명.확장자로 저장했을 경우

import os
import requests
import glob
from bs4 import BeautifulSoup
import urllib
import json
import re

API_KEY = '7f6a3f6a47d67acce54d297deb4298e2'  # Last.fm API 키

# 파일명에서 아티스트와 곡명 추출
def extract_artist_and_title(file_name):
    # 확장자 제거
    base_name = os.path.splitext(file_name)[0]
    
    # 파일명에서 '-'로 구분된 아티스트와 곡명 추출
    if '-' in base_name:
        artist, title = base_name.split('-', 1)
        return artist.strip(), title.strip()
    else:
        return None, None

# Bugs에서 아티스트와 트랙 ID 검색 (앨범명 없이 검색)
def get_artist_track_id(artist_name, title):
    search_url = f'https://music.bugs.co.kr/search/track?q={artist_name} {title}'
    search_soup = BeautifulSoup(requests.get(search_url).text, 'html.parser')
    
    # 검색 결과에서 트랙 ID 추출
    track_tag = search_soup.select_one("tr[trackid]")
    if track_tag:
        track_id = track_tag.get('trackid')
        return track_id
    return None

# 가사 다운로드
def download_lyrics(track_id, base_filename):
    lyrics_url = f'http://api.bugs.co.kr/3/tracks/{track_id}/lyrics?&api_key=b2de0fbe3380408bace96a5d1a76f800'
    urllib.request.urlretrieve(lyrics_url, f"{base_filename}.lrc")

    with open(f'{base_filename}.lrc', encoding='UTF8') as json_file:
        data = json.load(json_file)
    
    return data.get('result', {}).get('lyrics', None)

# LRC 파일 생성
def lrc_maker(base_filename, lyrics_text):
    TIME = []
    LYRICS = []
    mm = []
    ss = []
    xx = []

    lyrics_lines = lyrics_text.replace("＃", "\n").split("\n")
    for line in lyrics_lines:
        time_marker, lyric = line.rsplit("|", 1)
        TIME.append(float(time_marker))
        LYRICS.append(lyric)

    for time in TIME:
        xx.append(f"{time % 1:.2f}"[1:])
        ss.append(f"{int(time) % 60:02}")
        mm.append(f"{int(time) // 60:02}")

    with open(f'{base_filename}.lrc', 'w', encoding='UTF8') as file:
        for i in range(len(TIME)):
            file.write(f"[{mm[i]}:{ss[i]}{xx[i]}]{LYRICS[i]}\n")

    print(f"{base_filename}.lrc 파일을 생성했습니다.")


def process_music_files():
    # 지원하는 파일 확장자 목록
    FILE_LIST = []
    for extension in ["*.flac", "*.mp3", "*.wav", "*.webm"]:
        FILE_LIST.extend(glob.glob(extension))

    if FILE_LIST:
        for file_path in FILE_LIST:
            file_name = os.path.basename(file_path)
            artist, title = extract_artist_and_title(file_name)
            
            if artist and title:
                # Bugs에서 아티스트명과 곡명으로 트랙 ID 검색
                track_id = get_artist_track_id(artist, title)
                
                if track_id:
                    # 가사 다운로드
                    base_filename = os.path.splitext(file_path)[0]  # 확장자 제거
                    lyrics = download_lyrics(track_id, base_filename)
                    if lyrics:
                        # LRC 파일 생성
                        lrc_maker(base_filename, lyrics)
                    else:
                        print(f"{file_name}에 대한 가사를 찾을 수 없습니다.")
                else:
                    print(f"{file_name}에 대한 트랙을 찾을 수 없습니다.")
            else:
                print(f"파일명에서 아티스트와 곡명을 추출할 수 없습니다.")
    else:
        print("오디오 파일을 찾을 수 없습니다.")



# LRC 파일 읽기
def read_lrc(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    lrc_data = []
    for line in lines:
        match = re.match(r'\[(\d+):(\d+\.\d+)\](.*)', line)
        if match:
            minutes = int(match.group(1))
            seconds = float(match.group(2))
            text = match.group(3).strip()
            lrc_data.append((minutes * 60 + seconds, text))
    return lrc_data


if __name__ == '__main__':
    process_music_files()
    lrc_path = '아이유-밤편지.lrc'
    lrc = read_lrc(lrc_path)
    print(lrc)