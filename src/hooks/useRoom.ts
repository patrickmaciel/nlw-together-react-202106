import {useEffect, useState} from "react";
import {database} from "../services/firebase";
import {useAuth} from "./useAuth";

type QuestionsProps = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean,
  likeCount: number,
  // hasLiked: boolean,
  likeId: string | undefined,
}
type FireBaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean,
  likes: Record<string, {
    authorId: string
  }>
}>

export function useRoom(roomId: string) {
  const { user } = useAuth()
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
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          // hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id)
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id]) // empty execute only 1 time

  return { questions, title }
}
