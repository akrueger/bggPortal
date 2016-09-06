import React from 'react'
import { render } from 'react-dom'
import horizon from '@horizon/client'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

require('./styles/main.styl')

const hz = horizon({host: 'localhost:8181'})
const games = hz('games')

games.order('owned').above({owned: 10000}).fetch().subscribe(result =>
	result
)

const Main = () =>
	<MuiThemeProvider>
		<div className='main'>
			<div>n</div>
		</div>
	</MuiThemeProvider>

const root = document.getElementById('root')

render(<Main/>, root)
