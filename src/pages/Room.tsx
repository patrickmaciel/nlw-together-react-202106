import logoImg from '../assets/images/logo.svg'
import {Button} from "../components/Button";

import { useParams} from "react-router-dom";

import '../styles/room.scss'
import {RoomCode} from "../components/RoomCode";
import {FormEvent, useEffect, useState} from "react";
import {useAuth} from "../hooks/useAuth";
import {database} from "../services/firebase";

type FireBaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean
}>
type RoomsParams = {
  id: string
}
type QuestionsProps = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean
}

export function Room() {
  const { user } = useAuth()
  const params = useParams<RoomsParams>()
  const roomId = params.id
  const [newQuestion, setNewQuestion] = useState('')
  const [questions, setQuestions] = useState<QuestionsProps[]>([])
  const [title, setTitle] = useState('')

  // fire an event, when any information changed
  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)
    // once = one time
    // on = every time
    // TODO: improve this parte using  firebase child changed events
    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FireBaseQuestions = databaseRoom.questions ?? {}
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId]) // empty execute only 1 time

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') return

    if (!user) {
      throw new Error('You must me logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          >
          </textarea>

          <div className="form-footer">
            { user ? (
              <div className={'user-info'}>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, faça seu login <button>faça seu login</button></span>
            ) }
            <Button type='submit' disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        { JSON.stringify(questions) }
      </main>
    </div>
  )
}