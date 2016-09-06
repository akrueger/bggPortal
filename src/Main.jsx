import React from 'react'
import { render } from 'react-dom'
import horizon from '@horizon/client'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

require('./styles/main.styl')

const hz = horizon({host: 'localhost:8181'})
const gamesCollection = hz('games')

const Main = React.createClass({
	getInitialState() {
		return {
			games: []
		}
	},

	componentDidMount() {
		this.loadGames()
	},

	loadGames() {
		gamesCollection.order('owned').above({owned: 10000}).fetch().subscribe(result =>
			this.setState({games: result})
		)
	},

	render() {
		return (
			<MuiThemeProvider>
				<div className='main'>
					{this.state.games.map(games => <div>{games.name}</div>)}
				</div>
			</MuiThemeProvider>
		)
	}
})

const root = document.getElementById('root')

render(<Main/>, root)
