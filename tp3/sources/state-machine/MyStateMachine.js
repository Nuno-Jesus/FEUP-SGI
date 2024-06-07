import { MyFirework } from "../fireworks/MyFirework.js";

export class MyStateMachine
{
	static MAIN_MENU_STATE = "home";
	static GAME_STATE = "game";
	static GAME_OVER_STATE = "game_over";
	static PAUSE_STATE = "pause";

	constructor(initial_state, contents, reader)
	{
		this.state = initial_state;
		this.contents = contents;
		this.reader = reader;
		this.reader.stateMachine = this;
		this.contents.app.picker.stateMachine = this;
	}

	update()
	{
		switch (this.state)
		{
			case MyStateMachine.GAME_STATE:
				this.contents.mainMenu.visible = false;
				this.reader.update();
				break;
				
			case MyStateMachine.GAME_OVER_STATE:
				this.contents.mainMenu.visible = true;
				this.contents.app.activeCamera.position.set(30, 5, 0);
				this.reader.launchFireworks();
				break;
		}
	}
}