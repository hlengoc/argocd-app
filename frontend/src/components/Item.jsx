function Item(props) {
  return (
    //Legacy item
    // <div>
    //     <div className="container">
    //         <div className="row item">
    //             <div className="col-10 item-content-div">
    //             <h2>{props.title}</h2>
    //             <p>From:</p>
    //             <p>To:</p>
    //             <p>Old stuffs:</p>
    //             </div>
    //             <div className="col-lg-2 item-img-div">
    //             <img className="item-img img-thumbnail rounded" src={props.src}></img>
    //             </div>
    //         </div>
    //     </div>
    // </div>
    <div className="col-sm-4">
      <div className="card" style={{width: "20rem"}}>
        <img src="images/dog-img.jpg" className="card-img-top" alt="..."></img>
        <div className="card-body">
          <h5 className="card-title">{props.title}</h5>
          <p className="card-text">{props.name}</p>
          <a href="#" className="btn btn-primary">
            See more
          </a>
        </div>
      </div>
    </div>
  );
}

export default Item;
