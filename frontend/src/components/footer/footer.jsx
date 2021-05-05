import React from "react";

class Footer extends React.Component {
  constructor(props) {
    super(props);

    var date = new Date();
    this.state = {
      year: date.getFullYear(),
    };
  }
  render() {
    return (
      <div id="footer" className="footer">
        &copy; {this.state.year} Sistemas de Bases de Datos 2
      </div>
    );
  }
}

export default Footer;
