import { getSaudacao } from "../../utils/Saudacao";

function Header () {
    return (
        <>
        <h1 className="title">{getSaudacao()}</h1>
        <p>Vamos Marcar o seu dia</p>
        </>
    )
}
export default Header;