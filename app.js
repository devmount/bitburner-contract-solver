// query necessary elements
const typeSelect = document.querySelector('#type');
const taskInput = document.querySelector('#task');
const trigger = document.querySelector('#trigger');
const result = document.querySelector('#result');

// empty task input and result on type change and set placeholder
typeSelect.addEventListener('change', (e) => {
	taskInput.value = '';
	const placeholder = e.target.value && db[e.target.value].example
		? 'e.g.:\n\n' + db[e.target.value].example
		: 'Insert task input data here';
	taskInput.setAttribute('placeholder', placeholder);
	result.innerText = '';
});
// solve task on trigger click
trigger.addEventListener('click', () => {
	const type = typeSelect.value;
	const task = taskInput.value;
	if (type) {
		result.innerText = db[type].solver(task);
	}
});
// copy result when clicking the result area
result.addEventListener('click', () => {
	navigator.clipboard.writeText(result.innerText);
});

// list of solver per type
// based on https://github.com/bitburner-official/bitburner-src/blob/dev/src/data/codingcontracttypes.ts
let db = {
	findLargestPrimeFactor: {
		name: "Find Largest Prime Factor",
		example: "335045386",
		solver: (data) => {
			let fac = 2;
			let n = data;
			while (n > (fac - 1) * (fac - 1)) {
				while (n % fac === 0) {
					n = Math.round(n / fac);
				}
				++fac;
			}
			return (n === 1 ? fac - 1 : n);
		},
	},
	subarrayWithMaximumSum: {
		name: "Subarray with Maximum Sum",
		example: "-9,3,8,-3,8,-9,-7,7,8,-8,...",
		solver: (data) => {
			data = data.split(',').map(n => parseInt(n));
			const nums = data.slice();
			for (let i = 1; i < nums.length; i++) {
				nums[i] = Math.max(nums[i], nums[i] + nums[i - 1]);
			}
			return Math.max(...nums);
		},
	},
	totalWaysToSum: {
		name: "Total Ways to Sum",
		example: "37",
		solver: (data) => {
			const ways = [1];
			ways.length = data + 1;
			ways.fill(0, 1);
			for (let i = 1; i < data; ++i) {
				for (let j = i; j <= data; ++j) {
					ways[j] += ways[j - i];
				}
			}

			return ways[data];
		},
	},
	totalWaysToSumIi: {
		name: "Total Ways to Sum II",
		example: "15 1,2,3,4,7,8,10,11,14",
		solver: (data) => {
			data = data.split(' ');
			// https://www.geeksforgeeks.org/coin-change-dp-7/?ref=lbp
			const n = data[0];
			const s = data[1].split(',').map(n => parseInt(n));
			const ways = [1];
			ways.length = n + 1;
			ways.fill(0, 1);
			for (let i = 0; i < s.length; i++) {
				for (let j = s[i]; j <= n; j++) {
					ways[j] += ways[j - s[i]];
				}
			}
			return ways[n];
		},
	},
	spiralizeMatrix: {
		name: "Spiralize Matrix",
		example: "[4,31,7,47,23,13,35,30,12,22,28]\n[19,46,7,11,29,23,2,48,45,40,46]\n[25,24,44,33,43,2,15,5,14,9,4]\n[42,35,16,13,44,33,27,50,47,5,37]\n...",
		solver: (data) => {
			data = data.split('\n').map(l => JSON.parse(l));
			const spiral = [];
			const m = data.length;
			const n = data[0].length;
			let u = 0;
			let d = m - 1;
			let l = 0;
			let r = n - 1;
			let k = 0;
			let done = false;
			while (!done) {
				// Up
				for (let col = l; col <= r; col++) {
					spiral[k] = data[u][col];
					++k;
				}
				if (++u > d) {
					done = true;
					continue;
				}

				// Right
				for (let row = u; row <= d; row++) {
					spiral[k] = data[row][r];
					++k;
				}
				if (--r < l) {
					done = true;
					continue;
				}

				// Down
				for (let col = r; col >= l; col--) {
					spiral[k] = data[d][col];
					++k;
				}
				if (--d < u) {
					done = true;
					continue;
				}

				// Left
				for (let row = d; row >= u; row--) {
					spiral[k] = data[row][l];
					++k;
				}
				if (++l > r) {
					done = true;
					continue;
				}
			}
			return '[' + spiral + ']';
		},
	},
	arrayJumpingGame: {
		name: "Array Jumping Game",
		example: "2,0,7,5,7,5,0,10,0,6,0,8,0,4,1,7,10",
		solver: (data) => {
			data = data.split(',').map(n => parseInt(n));
			const n = data.length;
			let i = 0;
			for (let reach = 0; i < n && i <= reach; ++i) {
				reach = Math.max(i + data[i], reach);
			}
			return i === n;
		},
	},
	arrayJumpingGameIi: {
		name: "Array Jumping Game II",
		example: "2,1,2,1,4,6,3",
		solver: (data) => {
			data = data.split(',').map(n => parseInt(n));
			const n = data.length;
			let reach = 0;
			let jumps = 0;
			let lastJump = -1;
			while (reach < n - 1) {
				let jumpedFrom = -1;
				for (let i = reach; i > lastJump; i--) {
					if (i + data[i] > reach) {
						reach = i + data[i];
						jumpedFrom = i;
					}
				}
				if (jumpedFrom === -1) {
					jumps = 0;
					break;
				}
				lastJump = jumpedFrom;
				jumps++;
			}
			return jumps;
		},
	},
	mergeOverlappingIntervals: {
		name: "Merge Overlapping Intervals",
		example: "[[23,30],[5,10],[9,19],[9,12],[11,20],...]",
		solver: (data) => {
			data = JSON.parse(data);
			const intervals = data.slice();
			intervals.sort((a, b) => {
				return a[0] - b[0];
			});
			const result = [];
			let start = intervals[0][0];
			let end = intervals[0][1];
			for (const interval of intervals) {
				if (interval[0] <= end) {
					end = Math.max(end, interval[1]);
				} else {
					result.push([start, end]);
					start = interval[0];
					end = interval[1];
				}
			}
			result.push([start, end]);
			return convert2DArrayToString(result);
		},
	},
	generateIpAddresses: {
		name: "Generate IP Addresses",
		example: "16323010389",
		solver: (data) => {
			const ret = [];
			for (let a = 1; a <= 3; ++a) {
				for (let b = 1; b <= 3; ++b) {
					for (let c = 1; c <= 3; ++c) {
						for (let d = 1; d <= 3; ++d) {
							if (a + b + c + d === data.length) {
								const A = parseInt(data.substring(0, a), 10);
								const B = parseInt(data.substring(a, a + b), 10);
								const C = parseInt(data.substring(a + b, a + b + c), 10);
								const D = parseInt(data.substring(a + b + c, a + b + c + d), 10);
								if (A <= 255 && B <= 255 && C <= 255 && D <= 255) {
									const ip = [A.toString(), ".", B.toString(), ".", C.toString(), ".", D.toString()].join("");
									if (ip.length === data.length + 3) {
										ret.push(ip);
									}
								}
							}
						}
					}
				}
			}
			return '[' + ret.join(',') + ']';
		},
	},
	algorithmicStockTraderI: {
		name: "Algorithmic Stock Trader I",
		example: "184,173,9,22,194,2,99,141,145,18,30,189,54,43,3,14,...",
		solver: (data) => {
			data = data.split(',').map(n => parseInt(n));
			let maxCur = 0;
			let maxSoFar = 0;
			for (let i = 1; i < data.length; ++i) {
				maxCur = Math.max(0, (maxCur += data[i] - data[i - 1]));
				maxSoFar = Math.max(maxCur, maxSoFar);
			}
			return maxSoFar.toString();
		},
	},
	algorithmicStockTraderIi: {
		name: "Algorithmic Stock Trader II",
		example: "66,60,200,158,70,196,29,...",
		solver: (data) => {
			data = data.split(',').map(n => parseInt(n));
			let profit = 0;
			for (let p = 1; p < data.length; ++p) {
				profit += Math.max(data[p] - data[p - 1], 0);
			}
			return profit.toString();
		},
	},
	algorithmicStockTraderIii: {
		name: "Algorithmic Stock Trader III",
		example: "86,126,188,85,112,77,39,69,...",
		solver: (data) => {
			data = data.split(',').map(n => parseInt(n));
			let hold1 = Number.MIN_SAFE_INTEGER;
			let hold2 = Number.MIN_SAFE_INTEGER;
			let release1 = 0;
			let release2 = 0;
			for (const price of data) {
				release2 = Math.max(release2, hold2 + price);
				hold2 = Math.max(hold2, release1 - price);
				release1 = Math.max(release1, hold1 + price);
				hold1 = Math.max(hold1, price * -1);
			}

			return release2.toString();
		},
	},
	algorithmicStockTraderIv: {
		name: "Algorithmic Stock Trader IV",
		example: "[6, [88,13,160,50,76,136,96,23,72,25,34,73,118]]",
		solver: (data) => {
			data = JSON.parse(data);
			const k = data[0];
			const prices = data[1];
			const len = prices.length;
			if (len < 2) {
				return 0;
			}
			if (k > len / 2) {
				let res = 0;
				for (let i = 1; i < len; ++i) {
					res += Math.max(prices[i] - prices[i - 1], 0);
				}
				return res;
			}
			const hold = [];
			const rele = [];
			hold.length = k + 1;
			rele.length = k + 1;
			for (let i = 0; i <= k; ++i) {
				hold[i] = Number.MIN_SAFE_INTEGER;
				rele[i] = 0;
			}
			let cur;
			for (let i = 0; i < len; ++i) {
				cur = prices[i];
				for (let j = k; j > 0; --j) {
					rele[j] = Math.max(rele[j], hold[j] + cur);
					hold[j] = Math.max(hold[j], rele[j - 1] - cur);
				}
			}
			return rele[k];
		},
	},
	minimumPathSumInATriangle: {
		name: "Minimum Path Sum in a Triangle",
		example: "[\n     [1],\n    [6,7],\n   [9,4,6],\n  [7,2,2,4],\n [9,8,2,5,5],\n]",
		solver: (data) => {
			data = JSON.parse(data);
			const n = data.length;
			const dp = data[n - 1].slice();
			for (let i = n - 2; i > -1; --i) {
				for (let j = 0; j < data[i].length; ++j) {
					dp[j] = Math.min(dp[j], dp[j + 1]) + data[i][j];
				}
			}
			return dp[0];
		},
	},
	uniquePathsInAGridI: {
		name: "Unique Paths in a Grid I",
		example: "[9, 14]",
		solver: (data) => {
			data = JSON.parse(data);
			const n = data[0]; // Number of rows
			const m = data[1]; // Number of columns
			const currentRow = [];
			currentRow.length = n;
			for (let i = 0; i < n; i++) {
				currentRow[i] = 1;
			}
			for (let row = 1; row < m; row++) {
				for (let i = 1; i < n; i++) {
					currentRow[i] += currentRow[i - 1];
				}
			}
			return currentRow[n - 1];
		},
	},
	uniquePathsInAGridIi: {
		name: "Unique Paths in a Grid II",
		example: "0,0,0,0,0,0,0,1,0,0,1,0,\n1,0,0,0,0,0,0,0,0,1,0,0,\n...",
		solver: (data) => {
			data = data.split('\n').map(l => l.slice(0,-1).split(','));
			const obstacleGrid = [];
			obstacleGrid.length = data.length;
			for (let i = 0; i < obstacleGrid.length; ++i) {
				obstacleGrid[i] = data[i].slice();
			}
			for (let i = 0; i < obstacleGrid.length; i++) {
				for (let j = 0; j < obstacleGrid[0].length; j++) {
					if (obstacleGrid[i][j] == 1) {
						obstacleGrid[i][j] = 0;
					} else if (i == 0 && j == 0) {
						obstacleGrid[0][0] = 1;
					} else {
						obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i - 1][j] : 0) + (j > 0 ? obstacleGrid[i][j - 1] : 0);
					}
				}
			}
			return obstacleGrid[obstacleGrid.length - 1][obstacleGrid[0].length - 1];
		},
	},
	shortestPathInAGrid: {
		name: "Shortest Path in a Grid",
		example: "[[0,1,0,0,0],\n [0,0,0,1,0]]",
		solver: (data) => {
			data = JSON.parse(data);
			const width = data[0].length;
			const height = data.length;
			const dstY = height - 1;
			const dstX = width - 1;

			const distance = new Array(height);
			//const prev: [[number, number] | undefined][] = new Array(height);
			const queue = [];

			for (let y = 0; y < height; y++) {
				distance[y] = new Array(width).fill(Infinity);
				//prev[y] = new Array(width).fill(undefined) as [undefined];
			}

			function validPosition(y, x) {
				return y >= 0 && y < height && x >= 0 && x < width && data[y][x] == 0;
			}

			// List in-bounds and passable neighbors
			function* neighbors(y, x) {
				if (validPosition(y - 1, x)) yield [y - 1, x]; // Up
				if (validPosition(y + 1, x)) yield [y + 1, x]; // Down
				if (validPosition(y, x - 1)) yield [y, x - 1]; // Left
				if (validPosition(y, x + 1)) yield [y, x + 1]; // Right
			}

			// Prepare starting point
			distance[0][0] = 0;
			queue.push([0, 0]);

			// Take next-nearest position and expand potential paths from there
			while (queue.length > 0) {
				const [y, x] = queue.shift();
				for (const [yN, xN] of neighbors(y, x)) {
					if (distance[yN][xN] == Infinity) {
						queue.push([yN, xN]);
						distance[yN][xN] = distance[y][x] + 1;
					}
				}
			}

			// No path at all?
			if (distance[dstY][dstX] == Infinity) return '""';
			
			//trace a path back to start
			let path = "";
			let [yC, xC] = [dstY, dstX];
			while (xC != 0 || yC != 0) {
				const dist = distance[yC][xC];
				for (const [yF, xF] of neighbors(yC, xC)) {
					if (distance[yF][xF] == dist - 1) {
						path = (xC == xF ? (yC == yF + 1 ? "D" : "U") : (xC == xF + 1 ? "R" : "L")) + path;
						[yC, xC] = [yF, xF];
						break;
					}
				}
			}

			return path;
		},
	},
	sanitizeParenthesesInExpression: {
		name: "Sanitize Parentheses in Expression",
		example: "((()(()((aa())",
		solver: (data) => {
			let left = 0;
			let right = 0;
			const res = [];

			for (let i = 0; i < data.length; ++i) {
				if (data[i] === "(") {
					++left;
				} else if (data[i] === ")") {
					left > 0 ? --left : ++right;
				}
			}

			function dfs(
				pair,
				index,
				left,
				right,
				s,
				solution,
				res,
			) {
				if (s.length === index) {
					if (left === 0 && right === 0 && pair === 0) {
						for (let i = 0; i < res.length; i++) {
							if (res[i] === solution) {
								return;
							}
						}
						res.push(solution);
					}
					return;
				}

				if (s[index] === "(") {
					if (left > 0) {
						dfs(pair, index + 1, left - 1, right, s, solution, res);
					}
					dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
				} else if (s[index] === ")") {
					if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
					if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
				} else {
					dfs(pair, index + 1, left, right, s, solution + s[index], res);
				}
			}
			dfs(0, 0, left, right, data, "", res);
			return '[' + res + ']';
		},
	},
	findAllValidMathExpressions: {
		name: "Find All Valid Math Expressions",
		example: "['35474004', 82]",
		solver: (data) => {
			data = JSON.parse(data);
			const num = data[0];
			const target = data[1];

			function helper(
				res,
				path,
				num,
				target,
				pos,
				evaluated,
				multed,
			) {
				if (pos === num.length) {
					if (target === evaluated) {
						res.push(path);
					}
					return;
				}

				for (let i = pos; i < num.length; ++i) {
					if (i != pos && num[pos] == "0") {
						break;
					}
					const cur = parseInt(num.substring(pos, i + 1));

					if (pos === 0) {
						helper(res, path + cur, num, target, i + 1, cur, cur);
					} else {
						helper(res, path + "+" + cur, num, target, i + 1, evaluated + cur, cur);
						helper(res, path + "-" + cur, num, target, i + 1, evaluated - cur, -cur);
						helper(res, path + "*" + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur);
					}
				}
			}
			if (num == null || num.length === 0) {
				return 0;
			}

			const result = [];
			helper(result, "", num, target, 0, 0, 0);
			return '[' + result + ']';
		},
	},
	hammingCodesIntegerToEncodedBinary: {
		name: "HammingCodes: Integer to Encoded Binary",
		example: "799766358",
		solver: (data) => {
			return HammingEncode(Number(data));
		},
	},
	hammingCodesEncodedBinaryToInteger: {
		name: "HammingCodes: Encoded Binary to Integer",
		example: "1110101001110100",
		solver: (data) => {
			return HammingDecode(data);
		},
	},
	proper2ColoringOfAGraph: {
		name: "Proper 2-Coloring of a Graph",
		example: "[4, [[0, 2], [0, 3], [1, 2], [1, 3]]]",
		solver: (data) => {
			data = JSON.parse(data);
			// convert from edges to nodes
			const nodes = new Array(data[0]).fill(0).map(() => []);
			for (const e of data[1]) {
				nodes[e[0]].push(e[1]);
				nodes[e[1]].push(e[0]);
			}
			// solution graph starts out undefined and fills in with 0s and 1s
			const solution = new Array(data[0]).fill(undefined);
			let oddCycleFound = false;
			// recursive function for DFS
			const traverse = (index, color) => {
				if (oddCycleFound) {
					// leave immediately if an invalid cycle was found
					return;
				}
				if (solution[index] === color) {
					// node was already hit and is correctly colored
					return;
				}
				if (solution[index] === (color ^ 1)) {
					// node was already hit and is incorrectly colored: graph is uncolorable
					oddCycleFound = true;
					return;
				}
				solution[index] = color;
				for (const n of nodes[index]) {
					traverse(n, color ^ 1);
				}
			}
			// repeat run for as long as undefined nodes are found, in case graph isn't fully connected
			while (!oddCycleFound && solution.some(e => e === undefined)) {
				traverse(solution.indexOf(undefined), 0);
			}
			if (oddCycleFound) return "[]"; // TODO: Bug #3755 in bitburner requires a string literal. Will this be fixed?
			return solution;
		},
	},
	compressionIRleCompression: {
		name: "Compression I: RLE Compression",
		example: "aaaaabccc",
		solver: (plain) => {
			let length = 0;
			let result = '';
			for (let i = 0; i < plain.length; ) {
				let run_length = 1;
				while (i + run_length < plain.length && plain[i + run_length] === plain[i]) {
					++run_length;
				}
				i += run_length;
				
				while (run_length > 0) {
					result += String(run_length > 9 ? 9 : run_length)+plain[i-1];
					run_length -= 9;
					length += 2;
				}
			}

			return result;
		},
	},
	compressionIILzDecompression: {
		name: "Compression II: LZ Decompression",
		example: "5aaabb450723abb",
		solver: (compr) => {
			return comprLZDecode(compr);
		},
	},
	compressionIIILzCompression: {
		name: "Compression III: LZ Compression",
		example: "abracadabra",
		solver: (plain) => {
			return comprLZEncode(plain);
		},
	},
	encryptionICaesarCipher: {
		name: "Encryption I: Caesar Cipher",
		example: "[\"FLASH MODEM EMAIL ENTER FRAME\", 8]",
		solver: (data) => {
			data = JSON.parse(data);
			// data = [plaintext, shift value]
			// build char array, shifting via map and join to final results
			const cipher = [...data[0]]
				.map((a) => (a === " " ? a : String.fromCharCode(((a.charCodeAt(0) - 65 - data[1] + 26) % 26) + 65)))
				.join("");
			return cipher;
		},
	},
	encryptionIiVigenèreCipher: {
		name: "Encryption II: Vigenère Cipher",
		example: "[\"INBOXLOGICLOGINMEDIAMOUSE\", \"COMPUTER\"]",
		solver: (data) => {
			data = JSON.parse(data);
			// data = [plaintext, keyword]
			// build char array, shifting via map and corresponding keyword letter and join to final results
			const cipher = [...data[0]]
				.map((a, i) => {
					return a === " "
						? a
						: String.fromCharCode(((a.charCodeAt(0) - 2 * 65 + data[1].charCodeAt(i % data[1].length)) % 26) + 65);
				})
				.join("");
			return cipher;
		},
	},
};

// initially load all task types
for (const type in db) {
	const { name } = db[type];
	let option = document.createElement("option");
	option.value = type;
	option.innerText = name;
	typeSelect.append(option);
}
