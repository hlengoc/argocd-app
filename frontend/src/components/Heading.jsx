import "./Heading.css";

function Heading() {
  function handleClick(props) {
    alert(
      "Please Sign-up first. Click the user icon in the right up corner to sign-up. If you already signed-up, use Test button below to login and see cute pets ^^"
    );
  }
  return (
    <div id="title" className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light">
        <a className="navbar-brand" href="https://lehai2909.github.io">
          Welcome to Hai's website <i className="bi bi-emoji-smile"></i>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="https://lehai2909.github.io">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://lehai2909.github.io">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://lehai2909.github.io">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="px-4 py-5 my-5 text-center">
        <img
          className="d-block mx-auto mb-4"
          src="images/dog.svg"
          alt=""
          width="200"
          height="200"
        />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <h1 className="m-5 display-5 fw-bold text-body-emphasis">
          New Home for Paws...
        </h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            "New Home for Paws" is a digital platform designed to connect dog
            shelters, rescuers, and pet lovers. The goal is to help stray and
            abandoned dogs find loving homes through a simple, efficient, and
            heart-centered online experience. (Thank ChatGPT for this ^^)
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button
              type="button"
              className="btn btn-primary btn-lg px-4 gap-3"
              onClick={handleClick}
            >
              Let's see cat
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={handleClick}
            >
              Let's see dog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Heading;
