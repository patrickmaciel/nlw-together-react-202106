import { useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import {Button} from "../components/Button";
import {useAuth} from "../hooks/useAuth";
import {FormEvent, useState} from "react";
import {database} from "../services/firebase";

// In replacement of these 2 imports we use the hook useAuth
// import {useContext} from "react";
// import {AuthContext} from "../contexts/AuthContext";

import '../styles/auth.scss'

/**
 * always import any type of file inside a React Component
 * React does not understand paths of images for example
 * this is because of webpack (snowpack, vite, etc)
 * webpack = module bundler
 * @constructor
 */
export function Home() {
    const history = useHistory()
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState('')

    async function handleCreateRoom() {
        if (!user) {
            /**
             * the rest of the code are awaiting this
             * function finished the process
             */
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()
        if (roomCode.trim() === '') {
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get()
        if (!roomRef.exists()) {
            alert('Room does not exists.')
            return
        }

        if (roomRef.val().endedAt) {
            alert('Room already closed')
            return
        }

        history.push(`/rooms/${roomCode}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>
                <strong>Crie salas de Q&amp;A</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="Letmeask"/>
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconImg} alt="Logo do Google"/>
                        Crie sua sala com o Google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder='Digite o código da sala'
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type='submit'>
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
