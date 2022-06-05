import './App.css';

function App() {
  return (
    <section>
    <div className="product">
    <div>
    <form className="form" method="post" action="http://localhost:3000/payment">
        <input className="input" type="submit" value="pay"></input>
   </form>
    </div>
    </div>
  </section>
  );
}

export default App;
