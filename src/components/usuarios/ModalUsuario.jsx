import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';



const ModalUsuario = ({ Model, show, onHide, onAdd, onEdit }) => {

    const modalRef = useRef(null);

    const [usuario, setUsuario] = useState({
        id: null,
        userName: '',
        user: '',
        password: '',
        tipo_usuario: 0
    });

    useEffect(() => {
        if (Model != null) {
            setUsuario({
                id: Model.id,
                userName: Model.nome,
                user: Model.usuario,
                password: Model.senha,
                tipo_usuario: Model.tipo_usuario
            });
        }
    }, [Model]);

    const handleHide = async () => {
        onHide();
        await resetUsuario();
    };

    const handleUsuario = (evt, name = null) => {
        const value = evt.value ?? evt.target.value;
      
        setUsuario({
            ...usuario,
            [name ? name : evt.target.name]: value
        })

    }

    const resetUsuario = async () => {
        setUsuario({
            id: null,
            userName: '',
            user: '',
            password: '',
            tipo_usuario: '0'
        })
    }

    const handleAdd = async () => {
        onAdd(usuario);
        await resetUsuario();
    }

    const handleEdit = async () => {
        onEdit(usuario);
        await resetUsuario();
    }

    return (
        <>
            <Modal ref={modalRef} show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title><i className="fa-solid fa-users"></i> <small> Editar Usuario</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form className="form-control">

                        <div className="form-group">
                            <label htmlFor="userName">Nome <small className="campo-obrigatorio"></small></label>
                            <input
                                id="userName"
                                name="userName"
                                className="form-control shadow-none input-custom"
                                type="text"
                                placeholder="Nome"
                                value={usuario.userName}
                                onChange={handleUsuario}
                            />

                        </div>

                        <div className="form-group">
                            <label htmlFor="tipo_usuario">Tipo Usuário</label>
                            <select className="form-control shadow-none input-custom" value={usuario.tipo_usuario} onChange={handleUsuario} name="tipo_usuario" id='tipo_usuario'>
                                <option value="0">Normal</option>
                                <option value="1">Administrador</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="user">Usuário <small className="campo-obrigatorio"></small></label>
                            <input
                                id="user"
                                name="user"
                                className="form-control shadow-none input-custom"
                                type="text"
                                placeholder="Usuário"
                                value={usuario.user}
                                disabled={usuario.id != null}
                                onChange={handleUsuario}

                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Senha <small className="campo-obrigatorio"></small></label>
                            <input
                                id="password"
                                name="password"
                                className="form-control shadow-none input-custom"
                                type="password"
                                placeholder="Senha"
                                value={usuario.password}
                                onChange={handleUsuario}

                            />
                        </div>



                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-sm' variant="secondary" onClick={handleHide}>
                        <i className="fa-solid fa-times"></i> <small>Fechar</small>
                    </Button>
                    {
                        usuario.id != null ?

                            <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleEdit} disabled={!(usuario.userName && usuario.password)}>
                                <i className="fa-solid fa-save"></i>  <small>Salvar</small>
                            </Button>
                            :
                            <Button className='btn btn-sm btn-blue' type="submit" variant="primary" onClick={handleAdd} disabled={!(usuario.userName && usuario.password)}>
                                <i className="fa-solid fa-plus"></i>  <small>Adicionar</small>
                            </Button>


                    }

                </Modal.Footer>
            </Modal>
        </>
    );


}


export default ModalUsuario;