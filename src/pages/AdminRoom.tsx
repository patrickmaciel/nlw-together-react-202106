import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import {Button} from "../components/Button";

import {useHistory, useParams} from "react-router-dom";

import '../styles/room.scss'
import {RoomCode} from "../components/RoomCode";
import {database} from "../services/firebase";
import {Question} from "../components/Question";
import {useRoom} from "../hooks/useRoom";

type RoomsParams = {
  id: string
}

export function AdminRoom() {
  const params = useParams<RoomsParams>()
  const roomId = params.id
  const { questions, title } = useRoom(roomId)
  const history = useHistory()

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar a sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date()
      })

      history.push('/')
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button
              isOutlined
              onClick={() => handleEndRoom()}
              >Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}>
                <button
                  type={'button'}
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta"/>
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}

