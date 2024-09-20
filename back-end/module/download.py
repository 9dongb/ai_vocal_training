import yt_dlp as youtube_dl
import tkinter as tk
from tkinter import ttk, messagebox

# 유튜브 검색 함수
def youtube_search(query):
    ydl_opts = {
        'default_search': 'ytsearch5',
        'quiet': True,
        'skip_download': True,
        'no_warnings': True,
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        result = ydl.extract_info(query, download=False)
    return result['entries']

# 오디오 다운로드 함수
def download_audio(url, output_path="downloaded_audio.webm"):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'postprocessors': [],
        'quiet': True,
        'no_warnings': True,
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

# GUI 생성 함수
def create_gui():
    def search_videos():
        query = entry.get()
        if not query:
            messagebox.showerror("오류", "검색어를 입력하세요.")
            return

        global search_results
        search_results = youtube_search(query)
        if not search_results:
            messagebox.showerror("오류", "검색 결과가 없습니다.")
            return

        listbox.delete(0, tk.END)
        for i, result in enumerate(search_results):
            listbox.insert(tk.END, f"{i + 1}. {result['title']}")

        listbox.selection_set(0)

    def download_selected_video():
        selected_index = listbox.curselection()
        if not selected_index:
            messagebox.showerror("오류", "다운로드할 영상을 선택하세요.")
            return

        selected_video = search_results[selected_index[0]]
        output_path = f"C:/Git/ai_vocal_training/assets/audio/{selected_video['title']}.webm"
        download_audio(selected_video['webpage_url'], output_path)

        messagebox.showinfo("완료", f"오디오 다운로드 완료: {selected_video['title']}\n저장 위치: {output_path}")

    root = tk.Tk()
    root.title("유튜브 오디오 다운로더")

    entry = tk.Entry(root, width=50)
    entry.pack(pady=10)

    search_button = tk.Button(root, text="검색", command=search_videos)
    search_button.pack()

    listbox = tk.Listbox(root, width=80, height=10)
    listbox.pack(pady=10)

    download_button = tk.Button(root, text="다운로드", command=download_selected_video)
    download_button.pack(pady=10)

    root.mainloop()

if __name__ == "__main__":
    search_results = []  
    create_gui()
