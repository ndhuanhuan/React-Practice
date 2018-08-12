import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// const list = [
//   {
//     title: 'React',
//     url: 'https://facebook.github.io/react/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0
//   }, {
//     title: 'Redux',
//     url: 'https://github.com/reactjs/redux',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1
//   }
// ];

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };

    this.searchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({result});
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`).then(response => response.json()).then(result => this.setSearchTopStories(result)).catch(e => e);
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value})
  }

  onDismiss(id) {
    // function isNotId(item) {
    //   return item.objectID !== id;
    // }
    //
    // const updatedList = this.state.list.filter(isNotId);
    // this.setState({list: updatedList});

    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    //this.state.result is a complex object, we only want to modify hits property and assign to a new object
    this.setState({result: Object.assign({}, this.state.result, {hits: updatedHits})});
  }

  // render() {
  //   const { searchTerm, list } = this.state;
  //   return (<div className="App">
  //     <form>
  //       <input
  //         type="text"
  //         value={searchTerm}
  //         onChange={this.onSearchChange}/>
  //     </form>
  //     {
  //       list.filter(isSearched(searchTerm)).map((item) => <div key={item.objectID}>
  //         <span>
  //           <a href={item.url}>{item.title}</a>
  //         </span>
  //         <span>{item.author}</span>
  //         <span>{item.num_comments}</span>
  //         <span>{item.points}</span>
  //         <button onClick={() => this.onDismiss(item.objectID)} type="button">
  //           Dismiss
  //         </button>
  //       </div>)
  //     }
  //   </div>);
  // }

  render() {
    const {searchTerm, result} = this.state;
    return (<div className="page">
      <div className="interactions">
        <Search value={searchTerm} onChange={this.onSearchChange}>
          Search
        </Search>
      </div>
      {result && <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss}/>}
    </div>);
  }
}

const Search = ({value, onChange, children}) => <form>
  {children}
  <input type="text" value={value} onChange={onChange}/>
</form>

const Table = ({list, pattern, onDismiss}) => <div className="table">
  {
    list.filter(isSearched(pattern)).map(item => <div key={item.objectID} className="table-row">
      <span style={{
          width: '40%'
        }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{
          width: '30%'
        }}>
        {item.author}
      </span>
      <span style={{
          width: '10%'
        }}>
        {item.num_comments}
      </span>
      <span style={{
          width: '10%'
        }}>
        {item.points}
      </span>
      <span style={{
          width: '10%'
        }}>
        <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
          Dismiss
        </Button>
      </span>
    </div>)
  }
</div>

class Button extends Component {
  render() {
    const {
      onClick,
      className = '',
      children
    } = this.props;
    return (<button onClick={onClick} className={className} type="button">
      {children}
    </button>);
  }
}

export default App;
