import * as uuid from "uuid";
import * as color from "color";


class Player {
	id: String;
	color: [number, number, number];

	constructor() {
		this.id = uuid.v4();
		const c = color.hsv(Math.random() * 360, 100, 100).rgb()
		this.color = c.array() as [number, number, number];
	}
}

export default Player;
