import React, { Component } from 'react';
import Infinite from "react-infinite";

class Test extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      hasMoreItems: true,
      page: 0
    };
    console.log(React)
    // this.containerref = React.createRef()
  }
  loadItems() {
    const page = this.state.page;
    const items =
      require("./data.json").slice(page * 50, (page + 1) * 50) || [];
    this.setState({
      items: this.state.items.concat(items),
      page: page + 1,
      hasMoreItems: items.length === 0 ? false : true
    });
  }
  render() {
    const styles = {
      fontFamily: "sans-serif",
      textAlign: "center",
      border: "1px solid palevioletred",
      width: "80%",
      margin: "30px auto",
      height: "calc(100vh - 50px)",
      boxSizing: "border-box",
      background: "#fff"
    };
    return (
      <div style={styles} >
        <Header />
        <Infinite
          infiniteLoadBeginEdgeOffset={200}
          elementHeight={38}
          onInfiniteLoad={this.loadItems.bind(this)}
          loadingSpinnerDelegate={<div className="loader">Loading ...</div>}
          containerHeight={600}
        >
          {this.state.items.map((item, i) => {
            return <ListItem item={item} key={i} />
          })}
        </Infinite>
      </div>
    );
  }
}

const Header = (props)=>{
  const itemStyle = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "25%",
    background: "#fff",
    color: "palevioletred"
  }
  const wrapperStyle = {
    display: "flex",
    padding: "10px 5px",
    fontSize: "1.2em",
    boxSizing: "border-box",
    borderBottom: "1px solid palevioletred"
  }
  return(
    <div style={wrapperStyle}>
      <div style={itemStyle}>First Name</div>
      <div style={itemStyle}>Last Name</div>
      <div style={itemStyle}>Email</div>
      <div style={itemStyle}>Agency Name</div>
    </div>
  )
}

const ListItem = (props)=>{
  const itemStyle = {
    width: "25%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: "10px 5px"
  }
  const wrapperStyle = {
    //background: "#D6EAF8",
    //color: "#fff",
    fontFamily: "monospace",
    color: "#999",
    display: "flex",
    fontSize: "1em",
    boxSizing: "border-box"
  }
  return(
    <div style={wrapperStyle}>
      <div style={itemStyle}>{props.item.firstname}</div>
      <div style={itemStyle}>{props.item.lastname}</div>
      <div style={itemStyle}>{props.item.email}</div>
      <div style={itemStyle}>{props.item.agency_name}</div>
    </div>
  )
}


export default Test;