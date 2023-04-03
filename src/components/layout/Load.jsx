
const Load = ({ show, message }) => {
    return (
        <>
            {
                show ?
                    <div className="load-message">
                        <h3><i className="fas fa-spinner fa-spin"></i> {message ?? "Aguarde..."} </h3>
                    </div>
                : null
            }
        </>
    );
}

export default Load;