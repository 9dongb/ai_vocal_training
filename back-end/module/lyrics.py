import glob
import mutagen
import requests
from bs4 import BeautifulSoup
import os
import urllib
import json

FILE_LIST = []
available_file = []
available_artist = []
available_first_artist = []
available_second_artist = []
available_album = []
available_title = []
track_artistid = []
track_albumid = []
track_trackid = []
TIME = []
LYRICS = []
mm = []
ss = []
xx = []
success = 0
fail = 0

def track_clear():
    track_albumid.clear()
    track_artistid.clear()
    track_trackid.clear()

def time_clear():
    xx.clear()
    ss.clear()
    mm.clear()
    LYRICS.clear()
    TIME.clear()

def lrc_maker():
    global success
    global data
    global i
    global available_file
    TEXT = data['result']['lyrics']
    TEXT = TEXT.replace("＃", "\n")
    x = TEXT.count("|")
    base_filename = available_file[i].rsplit('.', 1)[0]
    with open(f'{base_filename}.lrc', 'w', encoding='UTF8') as file:
        file.write(TEXT)
    del TEXT
    TEXT = []
    with open(f'{base_filename}.lrc', 'r', encoding='UTF8') as file:
        for j in range(x):
            TEXT.append(file.readline().rstrip())
    for j in range(x):
        TIME.append(float(TEXT[j][:TEXT[j].rfind("|")]))
        LYRICS.append(TEXT[j][TEXT[j].rfind("|") + 1:])
    for j in range(x):
        xx.append(str(round(TIME[j] - int(TIME[j]), 2)))
        if int(TIME[j]) % 60 < 10:
            ss.append("0" + str(int(TIME[j]) % 60))
        else:
            ss.append(str(int(TIME[j]) % 60))
        if int(TIME[j]) // 60 < 10:
            mm.append("0" + str(int(TIME[j]) // 60))
        else:
            mm.append(str(int(TIME[j]) // 60))
    with open(f'{base_filename}.lrc', 'w', encoding='UTF8') as file:
        file.write('')
    for j in range(x):
        with open(f'{base_filename}.lrc', 'a', encoding='UTF8') as file:
            if j != x:
                file.write(f"[{mm[j]}:{ss[j]}{xx[j][1:]}]{LYRICS[j]}\n")
            else:
                file.write(f"[{mm[j]}:{ss[j]}{xx[j][1:]}]{LYRICS[j]}")
    time_clear()
    track_clear()
    del TEXT
    print(f"{i}. {available_file[i]}의 lrc파일을 가져왔습니다.")
    success += 1
    return success
    
def lrc_delete():
    global fail
    global i
    global available_file
    fail += 1
    track_clear()
    base_filename = available_file[i].rsplit('.', 1)[0]
    os.remove(f'{base_filename}.lrc')
    print(f"{available_file[i]} 은(는) 싱크가사를 지원하지 않습니다.")
    return fail

# flac, mp3, wav, webm 파일을 찾기
for extension in ["*.flac", "*.mp3", "*.wav", "*.webm"]:
    for file in glob.glob(extension):
        FILE_LIST.append(file)


if FILE_LIST:  # 오디오 파일이 있는지 확인하기
    for i in range(len(FILE_LIST)):
        file = mutagen.File(FILE_LIST[i])
        if file is not None and all(tag in file for tag in ['album', 'artist', 'title']):  # 아티스트, 앨범, 타이틀 태그 있는지 확인
            available_file.append(FILE_LIST[i])
            available_album.append(file['album'][0])
            available_title.append(file['title'][0])
            available_artist.append(file['artist'][0])
            if "," in file['artist'][0]:
                available_first_artist.append(file['artist'][0].split(",")[0])
                available_second_artist.append(file['artist'][0].split(",")[1])
            else:
                available_first_artist.append(file['artist'][0])
                available_second_artist.append('')
        else:
            print(f"{FILE_LIST[i]}의 태그가 없습니다.")
            print("태그를 수동으로 입력하세요:")
            title = input("제목: ")
            artist = input("아티스트: ")
            album = input("앨범: ")

            available_file.append(FILE_LIST[i])
            available_title.append(title)
            available_artist.append(artist)
            available_album.append(album)
            if "," in artist:
                available_first_artist.append(artist.split(",")[0])
                available_second_artist.append(artist.split(",")[1])
            else:
                available_first_artist.append(artist)
                available_second_artist.append('')
            fail += 1

    for i in range(len(available_file)):
        if available_second_artist[i] == '':
            soup_artist = BeautifulSoup(requests.get(f'https://music.bugs.co.kr/search/artist?q={available_artist[i]}').text, 'html.parser')
        else:
            soup_first_artist = BeautifulSoup(requests.get(f'https://music.bugs.co.kr/search/artist?q={available_first_artist[i]}').text, 'html.parser')
            soup_second_artist = BeautifulSoup(requests.get(f'https://music.bugs.co.kr/search/artist?q={available_second_artist[i]}').text, 'html.parser')
        soup_album = BeautifulSoup(requests.get(f'https://music.bugs.co.kr/search/album?q={available_artist[i]} {available_album[i]}').text, 'html.parser')
        soup_track = BeautifulSoup(requests.get(f'https://music.bugs.co.kr/search/track?q={available_artist[i]} {available_title[i]}').text, 'html.parser')

        if available_second_artist[i] == '':
            if soup_artist.select('#container > section > div > ul > li:nth-of-type(1) > figure > figcaption > a.artistTitle'):
                artist_artistid = soup_artist.select_one('#container > section > div > ul > li:nth-of-type(1) > figure > figcaption > a.artistTitle')['href'][32:-25]
            else:
                print(f"{available_file[i]}에 대한 검색 결과가 없습니다.")
                fail += 1
                continue
        else:
            if soup_first_artist.select('#container > section > div > ul > li:nth-of-type(1) > figure > figcaption > a.artistTitle'):
                artist_first_artistid = soup_first_artist.select_one('#container > section > div > ul > li:nth-of-type(1) > figure > figcaption > a.artistTitle')['href'][32:-25]
            else:
                print(f"{available_file[i]}에 대한 검색 결과가 없습니다.")
                fail += 1
                continue
            if soup_second_artist.select('#container > section > div > ul > li:nth-of-type(1) > figure > figcaption > a.artistTitle'):
                artist_second_artistid = soup_second_artist.select_one('#container > section > div > ul > li:nth-of-type(1) > figure > figcaption > a.artistTitle')['href'][32:-25]
            else:
                print(f"{available_file[i]}에 대한 검색 결과가 없습니다.")
                fail += 1
                continue  
        if soup_album.select('#container > section > div > ul > li:nth-of-type(1) > figure'):
            album_artistid = soup_album.select_one('#container > section > div > ul > li:nth-of-type(1) > figure')['artistid']
            album_albumid = soup_album.select_one('#container > section > div > ul > li:nth-of-type(1) > figure')['albumid']
        else:
            print(f"{available_file[i]}에 대한 검색 결과가 없습니다.")
            fail += 1
            continue

        for id in soup_track.find_all("tr"):
            if id.get('artistid'):
                track_artistid.append(id.get('artistid'))
            if id.get('albumid'):
                track_albumid.append(id.get('albumid'))
            if id.get('trackid'):
                track_trackid.append(id.get('trackid'))

        if available_second_artist[i] == '':
            if artist_artistid == album_artistid and artist_artistid in track_artistid:
                n = track_artistid.index(artist_artistid)
                base_filename = available_file[i].rsplit('.', 1)[0]
                urllib.request.urlretrieve(f'http://api.bugs.co.kr/3/tracks/{track_trackid[n]}/lyrics?&api_key=b2de0fbe3380408bace96a5d1a76f800', f"{base_filename}.lrc")
                with open(f'{base_filename}.lrc', encoding='UTF8') as json_file:
                    data = json.load(json_file)
                if data['result'] is not None:  # 싱크 가사 있을 때,
                    if "|" in data['result']['lyrics']:  # time이 있을 때,
                        lrc_maker()
                    else:  # time이 없을 때,
                        lrc_delete()
                else:  # 싱크 가사 없을 때,
                    lrc_delete()
            else:
                print(f"{available_file[i]}에 대한 검색 결과가 없습니다.")
                fail += 1
                track_clear()
        else:
            if artist_first_artistid == album_artistid and artist_second_artistid in track_artistid:
                n = track_artistid.index(artist_second_artistid)
                base_filename = available_file[i].rsplit('.', 1)[0]
                urllib.request.urlretrieve(f'http://api.bugs.co.kr/3/tracks/{track_trackid[n]}/lyrics?&api_key=b2de0fbe3380408bace96a5d1a76f800', f"{base_filename}.lrc")
                with open(f'{base_filename}.lrc', encoding='UTF8') as json_file:
                    data = json.load(json_file)
                if data['result'] is not None:  # 싱크 가사 있을 때,
                    if "|" in data['result']['lyrics']:  # time이 있을 때,
                        lrc_maker()
                    else:  # time이 없을 때,
                        lrc_delete()
                else:  # 싱크 가사 없을 때,
                    lrc_delete()
            elif artist_first_artistid == album_artistid and artist_first_artistid in track_artistid:
                n = track_artistid.index(artist_first_artistid)
                base_filename = available_file[i].rsplit('.', 1)[0]
                urllib.request.urlretrieve(f'http://api.bugs.co.kr/3/tracks/{track_trackid[n]}/lyrics?&api_key=b2de0fbe3380408bace96a5d1a76f800', f"{base_filename}.lrc")
                with open(f'{base_filename}.lrc', encoding='UTF8') as json_file:
                    data = json.load(json_file)
                if data['result'] is not None:  # 싱크 가사 있을 때,
                    if "|" in data['result']['lyrics']:  # time이 있을 때,
                        lrc_maker()
                    else:  # time이 없을 때,
                        lrc_delete()
                else:  # 싱크 가사 없을 때,
                    lrc_delete()
            else:
                print(f"{available_file[i]}에 대한 검색 결과가 없습니다.")
                fail += 1
                track_clear()

    print("============완료============")
    print(f"가져온 lrc파일 수 : {success} 개")
    print(f"실패한 곡 수 : {fail} 개")
    print("============================")

else:  # 오디오 파일이 없을 때
    print("==========ERROR===========")
    print("오디오 파일을 찾을 수 없습니다.")
    print("==========================")
