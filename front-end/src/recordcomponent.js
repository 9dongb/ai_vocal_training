import React, {useState, useRef} from 'react';

const RecordComponent = () =>{
  const [isRecording, setIsRecording] = useState(false); // 녹음 중인지 여부를 저장하는 상태
  const [audioBlob, setAudioBlob] = useState(null); // 녹음된 오디오 데이터를 저장하는 상태
  const mediaRecorderRef = useRef(null); //mediaRecorder 인스턴스를 저장할 ref
  const chunks = useRef([]); //녹음된 데이터 청크 저장할 ref

  //녹음 시작 함수
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({audio:true}); //사용자의 마이크 권한 요청 후 오디오 스트림 가져오기

    mediaRecorderRef.current = new MediaRecorder(stream); //MediaRecorder 인스턴스 생성

    //녹음 진행하면서 데이터를 청크 단위로 저장
    mediaRecorderRef.current.ondataavailable=(event) => {
      chunks.current.push(event.data);
    };

    //녹음 종료되면 호출, 청크들을 Blob으로 변환
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks.current,{type:'audio/wav'});
      setAudioBlob(blob);
      chunks.current=[]; //청크 초기화
    };

    //녹음 시작
    mediaRecorderRef.current.start();
    setIsRecording(true); //녹음상태를 true로 설정
  };

  //녹음 중지 함수
  const stopRecording = () => {
    mediaRecorderRef.current.stop(); //녹음 중지
    setIsRecording(false); //녹음 상태를 false로 설정
  };

  //녹음된 파일을 서버로 업로드하는 함수
  const handleUpload = () => {
    if(audioBlob){
      const formData = new FormData();
      formData.append('audio',audioBlob,'recording.wav'); //FormData에 오디오 파일 추가

      //서버에 파일 업로드 요청
      fetch('http://localhost:5000/upload',{
        method:'POST',
        body:formData,
      })
      .then(response => response.json()) // 서버 응답을 JSON 형태로 변환
        .then(data => console.log(data)) // 서버 응답 로그 출력
        .catch(error => console.error(error)); // 에러 로그 출력

    }
  };

  return (
    <div>
      {/* 녹음 시작/중지 버튼 */}
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {/* 녹음된 파일이 있을 때만 오디오 플레이어와 업로드 버튼 표시 */}
      {audioBlob && (
        <div>
          <audio controls src={URL.createObjectURL(audioBlob)} /> {/* 녹음된 파일 재생 */}
          <button onClick={handleUpload}>Upload</button> {/* 업로드 버튼 */}
        </div>
      )}
    </div>
  );

};
export default RecordComponent;