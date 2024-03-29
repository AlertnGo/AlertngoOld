import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import userServices from "../../services/userService";
import voitureService from "../../services/voitureService";
import { UserContext } from "../../context/user";
import useLoggedIn from "../../hooks/useLoggedIn";
import "./style.scss";

//componants
import AddPage from "../../components/Addpage";
//icons
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import Brightness6RoundedIcon from "@material-ui/icons/Brightness6Rounded";

function MyProfile() {
  useLoggedIn();
  const history = useHistory();
  const { logout, user, login, userId, token } = useContext(UserContext);
  const [newNdp, setNewNdp] = useState("");
  const [newName, setNewName] = useState("");
  const [toggle, setToggle] = useState(false);
  const [nameToggle, setNameToggle] = useState(false);
  const [error, setError] = useState("");

  const getConnected = async () => {
    try {
      const response = await userServices.profil(userId);
      login(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteOneCar = async (e) => {
    const id = e.currentTarget.id;
    try {
      await voitureService.deleteCar(id);
      getConnected();
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getConnected();
    } else {
      history.push("/me/login");
    }
  }, [history, token]);

  const addNew = async (e) => {
    e.preventDefault();
    const title = newNdp;
    try {
      await voitureService.addCar(title, userId);
      setNewNdp("");
      setToggle(!toggle);
      getConnected();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const changeName = async (e) => {
    e.preventDefault();
    try {
      await userServices.editName(userId, newName);
      setNewName("");
      setNameToggle(!nameToggle);
      getConnected();
    } catch (error) {
      setError(error.message);
    }
  };

  const ThemeChange = () => {
    document.documentElement.classList.toggle("darkmode");
  };

  const signout = () => {
    logout();
    // history.push("/me/login");
  };

  return (
    <main>
      <section className="myprofile">
        <section className="devider">
          <h3>Mes Informations</h3>
          {error === "" ? null : <p className="error">{error} </p>}
          <div className="infos">
            <div className="infodiv">
              <h2>{user?.user?.name}</h2>
              <button
                className="button"
                onClick={() => setNameToggle(!nameToggle)}
              >
                <EditRoundedIcon />
                <p>Modifier</p>
              </button>
            </div>
            {nameToggle === true ? (
              <AddPage
                addeSubmit={changeName}
                lable="Name"
                change={(e) => setNewName(e.target.value)}
                placeholder={user?.user?.name}
                max="20"
                cancel={() => setNameToggle(!nameToggle)}
              />
            ) : null}

            <div className="infodiv">
              <h2>{user?.user?.telephone}</h2>
            </div>

            <div className="infodiv">
              <h2>Thème</h2>
              <button className="button" onClick={ThemeChange}>
                <Brightness6RoundedIcon />
                <p>Basculer</p>
              </button>
            </div>

            <button className="button super" onClick={signout}>
              <ExitToAppRoundedIcon />
              <p>Déconnecter</p>
            </button>
          </div>
        </section>

        <section className="devider">
          <h3>Mes Vehicles</h3>

          <div className="ndpdivider">
            {user?.cars && user.cars.length === 0 ? (
              <p className="specialtext">
                Vous n'avez pas encore ajouté votre véhicule, cliquez sur le
                bouton ci-dessous pour ajouter vos véhicules
              </p>
            ) : (
              user?.cars?.map((car, index) => (
                <div className="ndpdiv" key={index}>
                  <p className="ndplate">{car.title}</p>
                  <div className="buttonset">
                    <button
                      className="button"
                      id={car.id}
                      onClick={deleteOneCar}
                    >
                      <DeleteRoundedIcon />
                      <p>Suprimer</p>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {toggle === true ? (
            <AddPage
              addeSubmit={addNew}
              lable="Numéro de d'immatriculation"
              change={(e) => setNewNdp(e.target.value)}
              placeholder="AA000AA"
              max="7"
              cancel={() => setToggle(!toggle)}
            />
          ) : null}
          <button className="button super" onClick={(e) => setToggle(!toggle)}>
            <AddBoxRoundedIcon />
            <p>Ajouter</p>
          </button>
        </section>
      </section>
    </main>
  );
}
export default MyProfile;
