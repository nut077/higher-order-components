import React, {Component} from 'react';

function forAuth(WrappedComponent) {
  return class extends Component {
    render() {
      const props = this.props;
      const {isLogin, credential, ...rest} = props;
      const auth = {isLogin, credential};

      return props.isLogin ? <WrappedComponent {...rest} auth={auth}/> : null;
    }
  }
}

function logProps(WrappedComponent) {
  return class extends Component {
    componentWillReceiveProps(nextProps) {
      console.log('Prev Props', this.props);
      console.log('Next Props', nextProps);
    }

    render() {
      return <WrappedComponent {...this.props}/>
    }
  };
}

/*const ProtectedComponent = ({auth}) => (
  <h2>Protected Content: {auth.isLogin.toString()}</h2>
);*/

function fetchApi(endpoint) {
  return new Promise((resolve, reject) => {
    if (!endpoint) {
      return reject(new Error('Endpoint is required.'))
    }
    return resolve({
      articles: [
        {id: 1, title: 'Article#1'},
        {id: 2, title: 'Article#2'},
        {id: 3, title: 'Article#3'}
      ]
    })
  })
}

function fetchData(WrappedComponent) {
  return class extends Component {
    state = {
      fetchData: {}
    };

    componentDidMount() {
      fetchApi(WrappedComponent.API_ENDPOINT)
        .then(fetchData => this.setState({fetchData}))
        .catch(error => console.log(error.message))
    };

    render() {
      return <WrappedComponent {...this.props}{...this.state}/>
    }
  }
}

class ProtectedComponent extends Component {
  static API_ENDPOINT = '/articles';

  render() {
    const {fetchData: {articles}} = this.props;

    return (
      <ul>
        {
          articles && articles.map(({id, title}) =>
            <li key={id}>{title}</li>
          )
        }
      </ul>
    )
  }
}

const EnhancedComponent = logProps(forAuth(fetchData(ProtectedComponent)));

class App extends Component {
  state = {
    isLogin: false,
    credential: {}
  };

  toggleLogin = () => {
    this.setState((prevState) => {
      const {isLogin} = prevState;
      if (isLogin) {
        return {
          isLogin: false, credential: {}
        }
      }
      return {
        isLogin: true,
        credential: {email: 'nut@hotmail.com', accessToken: 'token'}
      }
    })
  };

  render() {
    return (
      <div>
        <button onClick={this.toggleLogin}>Toggle</button>
        <EnhancedComponent {...this.state}/>
      </div>
    );
  }
}

export default App;
