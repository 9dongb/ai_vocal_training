import React, { useState } from 'react';
import './common/root.css';
import './join_member.css';
import { Link, useNavigate } from 'react-router-dom';

function Join_member() {
    const [nickname, setNickname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleJoin = async () => {
        // 필드 검증
        if (!nickname || !username || !password || !email) {
            alert('모든 필드를 입력해 주세요.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/register', { // 서버 엔드포인트
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname, username, password, email }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                // 회원가입 성공 시 메시지 표시 후 로그인 페이지로 이동
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login_member');
                }, 2000); // 2초 후 이동
            } else {
                // 회원가입 실패 시 오류 메시지 표시
                setError(data.message);
            }
        } catch (error) {
            console.error('회원가입 요청 실패:', error);
            setError('서버와의 통신에 실패했습니다.');
        }
    };

    return (
        <div className="body">
            <div className="container">
                <div className="join_member_main">
                    <div className="join_member_logo">
                        <img className="join_member_logo_img" src={"/img/logo.png"} alt="logo" />
                    </div>
                    <div className="join_member_area">
                        <h2>JOIN</h2>
                        <div className='join_member_nickname'>
                            <input
                                type='text'
                                id='nickname'
                                placeholder='NAME | 닉네임을 입력해주세요'
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                            <br />
                        </div>
                        <div className='join_member_username'>
                            <input
                                type='text'
                                id='username'
                                placeholder='ID | 아이디를 입력해주세요'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <br />
                        </div>
                        <div className='join_member_password'>
                            <input
                                type='password'
                                id='password'
                                placeholder='PW | 비밀번호를 입력해주세요'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='join_member_mail'>
                            <input
                                type='text'
                                id='mail'
                                placeholder='MAIL | 이메일을 입력해주세요'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <br />
                        </div>
                        <div className="join_member_user" onClick={handleJoin}>회원가입</div>
                        {error && <div className="error_message">{error}</div>}
                        {success && <div className="success_message">회원가입이 성공적으로 완료되었습니다!</div>}

                        <div className="join_login_container">
                            <Link to={"/login_member"}>
                                <div className="join_login">로그인</div>
                            </Link>&nbsp;|&nbsp;아이디 찾기&nbsp;|&nbsp;비밀번호 찾기
                        </div>
                    </div>
                    <div className="join_member_version">version 1.0</div>
                </div>
            </div>
        </div>
    );
}

export default Join_member;
