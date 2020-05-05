import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Badge } from 'reactstrap';

const InfoSerie = ({ match }) => {

  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState('INFO');
  const [genres, setGenres] = useState([]);

  const [data, setData] = useState({});

  useEffect(() => {

    axios
      .get('/api/series/' + match.params.id)
      .then(res => {
        setData(res.data)
        setForm(res.data)
      })

  }, [match.params.id])

  useEffect(() => {
    axios
      .get('/api/genres')
      .then(res => {
        setGenres(res.data.data)
        const genres = res.data.data;
      })
  }, [data])

  // custom header
  const masterHeader = {
    height: '50vh',
    minHeight: '500px',
    backgroundImage: `url('${data.background}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat'
  }

  const onChange = field => evt => {
    setForm({
      ...form,
      [field]: evt.target.value
    });
  }

  const seleciona = value => () => {
    setForm({
      ...form,
      status: value
    });
  }

  const save = () => {
    axios
      .put('/api/series/' + match.params.id, {
        ...form,
      })
      .then(res => {
        setSuccess(true);
      })
  }

  if (success) {
    return <Redirect to='/series' />
  }

  return (
    <div>
      <header style={masterHeader}>
        <div className='h-100' style={{ background: 'rgba(0,0,0,.7)' }}>
          <div className='h-100 container'>
            <div className='row h-100 align-items-center'>
              <div className='col-3'>
                <img src={data.poster} alt={data.name} className='img-fluid img-thumbnail' />
              </div>
              <div className='col-8'>
                <h1 className='font-weight-light text-white'>{data.name}</h1>
                <div className='lead text-white'>
                  {data.status === 'ASSISTIDO' && <Badge color='success'>Assistido</Badge>}
                  {data.status === 'PARA_ASSISTIR' && <Badge color='warning'>Para assistir</Badge>}
                  <span style={{ marginLeft: '15px' }}>
                    Gênero: {data.genre}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {
        mode === 'INFO' &&

        <div className='container'>
          <button onClick={() => setMode('EDIT')} className='btn btn-primary'>Editar</button>
        </div>
      }

      {
        mode === 'EDIT' &&

        <div className='container'>
          <h1>Editar Série</h1>

          <button onClick={() => setMode('INFO')} className='btn btn-primary'>Cancelar Edição</button>

          <form>
            <div className='form-group'>
              <label htmlFor='name'>Nome</label>
              <input type='text' value={form.name ? form.name : ""} onChange={onChange('name')} className='form-control' id='name' placeholder='Nome da série' />
            </div>
            <div className='form-group'>
              <label htmlFor='comments'>Comentários</label>
              <input type='text' value={form.comments ? form.comments : ""} onChange={onChange('comments')} className='form-control' id='comments' placeholder='Comentário' />
            </div>
            <div className='form-group'>
              <label htmlFor='genre'>Selecione o gênero</label>
              <select className='custom-select' id='genre' onChange={onChange('genre_id')} value={form.genre_id ? form.genre_id : ""}>
                <option value=''>Selecione...</option>
                {genres.map(genre => {
                  return <option key={genre.id} value={genre.id}>{genre.name}</option>
                })}

              </select>
            </div>

            <div className='form-group'>
              <div className='form-check'>
                <input className='form-check-input' type='radio' checked={form.status === 'ASSISTIDO'} name='status' id='assistido' value='ASSISTIDO' onChange={seleciona('ASSISTIDO')} />
                <label className='form-check-label' htmlFor='assistido'>
                  Assistido
              </label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='radio' checked={form.status === 'PARA_ASSISTIR'} name='status' id='paraAssistir' value='PARA_ASSISTIR' onChange={seleciona('PARA_ASSISTIR')} />
                <label className='form-check-label' htmlFor='paraAssistir'>
                  Para Assistir
              </label>
              </div>
            </div>

            <button type='button' className='btn btn-primary' onClick={save}>Salvar</button>
          </form>

        </div>

      }

    </div>

  )
}

export default InfoSerie;