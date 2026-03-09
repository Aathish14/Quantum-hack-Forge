import { Link } from "react-router-dom";

const Home = () => {

  return (
    <div>

      <h1>Women Safety App</h1>

      <Link to="/emergency">
        Go to Emergency System
      </Link>

    </div>
  );
};

export default Home;