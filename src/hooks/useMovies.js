import { useState, useRef, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'

export const useMovies = ({ search, sort }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const previusSearch = useRef(search) // useRef guarda una referencia de la busqueda anterior

  const getMovies = useCallback ( async ({search}) => { 
      if (search === previusSearch.current) return // si la busqueda es igual a la anterior no hagas nada
      try {
        setLoading(true)
        setError(null)
        previusSearch.current = search // actualiza la referencia de la busqueda anterior con la actual 
        const newMovies =await searchMovies({ search })
        setMovies(newMovies) 
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }, []) // useCallback memoriza la funcion y solo la ejecuta cuando cambia la dependencia, es igual a useMemo pero pensado para funciones 
  

  const sortedMovies = useMemo(() => { // useMemo memoriza el resultado de la funcion y solo lo ejecuta cuando cambia la dependencia  
    return sort
    ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) // ordena por titulo
    : movies
  }, [movies, sort]) 


  return { movies: sortedMovies, getMovies, loading, error }
}