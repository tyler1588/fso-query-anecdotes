import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import  { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from "./reducers/NotificationContext"

const App = () => {

  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    }
  })

  const handleVote = (anecdote) => {
    newAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1})
    dispatch({type: "SET", payload: `liked ${anecdote.content}`})
    setTimeout(() => dispatch({type: "CLEAR"}), 3000)
  }

  const result = useQuery('anecdotes', getAnecdotes)
  if ( result.isLoading ){
    return <div>loading data...</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
