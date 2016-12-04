#### 0.0.14 (2016-12-04)

##### Documentation Changes

* **jsdoc:** fix params ([5f65b5ca](https://github.com/AncientSouls/GraphSpreading/commit/5f65b5ca0830aa6cb8926263486781035629a823))
* **readme:** Compile before testing ([f6af1257](https://github.com/AncientSouls/GraphSpreading/commit/f6af1257d59115cc865d9ede8a37bf2dcdded055))

##### New Features

* **class:** #7 #8 Empruve last two commits to class-method logic. ([6deafada](https://github.com/AncientSouls/GraphSpreading/commit/6deafadad832e1ff6ac920e0e8f72c0f5675056b))
* **queryWrapper:** #8 context.wrapSpreadQuery and context.wrapPathQuery ([8a2f5354](https://github.com/AncientSouls/GraphSpreading/commit/8a2f535409dc1608d387239af60bac53017c19cd))
* **context:** #7 Support for context fromFields and toFields ([9d40f083](https://github.com/AncientSouls/GraphSpreading/commit/9d40f08380fd5f27b77c3b1102e792a6cce9c6c1))
* **queue:**
  * Callback support ([795e56c6](https://github.com/AncientSouls/GraphSpreading/commit/795e56c60c1bf1c411780af06a2992e17c36c84e))
  * Removeв duplicate methods from queue ([1a27a350](https://github.com/AncientSouls/GraphSpreading/commit/1a27a3504fb8a9556f701c98d05545bee19531f0))
* **launched:** Manager of field launched move out of Path and Spreader graph. ([11f82123](https://github.com/AncientSouls/GraphSpreading/commit/11f82123a61ea82bc0bde50f43addb7c35ec22bb))
* **each:** Move each into custom async callbacks method in class. ([30a7653c](https://github.com/AncientSouls/GraphSpreading/commit/30a7653c8704dda963f554facc963d6f0849c08c))
* **async:** universal each syntax ([b5e04dfe](https://github.com/AncientSouls/GraphSpreading/commit/b5e04dfee1b9f86bc2cb6d5a86578cd636d1a1b8))
* **graphs:**
  * app logic out of package ([760e8544](https://github.com/AncientSouls/GraphSpreading/commit/760e85448481557a81d3b5f592c8616c298b586a))
  * respread class for spread->spreader dependencies ([ad7c2ffc](https://github.com/AncientSouls/GraphSpreading/commit/ad7c2ffc16f7f79e3aceb8a95aa57d4d35cb4940))
* **path:** fromFields toFields #1 ([1d404c94](https://github.com/AncientSouls/GraphSpreading/commit/1d404c94c31aa605ef2071e51546ae5c24fe8a5b))
* **graph:** constructor config argument support #6 ([76104458](https://github.com/AncientSouls/GraphSpreading/commit/76104458011a312e8bd0aa0cab3bb430152ad7a1))
* **spreading:** spreadTo #4 and unspread #5 ([ea6e2e3a](https://github.com/AncientSouls/GraphSpreading/commit/ea6e2e3aa78924ef3353bda9833cee57c1616f6a))
* **SpreaderGraph:** Spreader of spread links by paths graphs with tests and docs. ([a63e32df](https://github.com/AncientSouls/GraphSpreading/commit/a63e32df85d67387b113adb424f2bdb4febac400))

##### Bug Fixes

* **spreading:**
  * Support for pathLink in _getToFields and _getFromFields. ([c04a122e](https://github.com/AncientSouls/GraphSpreading/commit/c04a122ed80a9e1398afa06fb0c74abdc4aba707))
  * spreadTo support for toFields array, not just first of all... ([7301f7e5](https://github.com/AncientSouls/GraphSpreading/commit/7301f7e543fb71295cbad19f1813276fea888fba))
  * Wrong field name ([befd9659](https://github.com/AncientSouls/GraphSpreading/commit/befd9659d8779040c7bf95b23f18b043b63cd173))
* **errors:** Remove useless errors. ([5eb46fda](https://github.com/AncientSouls/GraphSpreading/commit/5eb46fdab83222772442dc954d1cd6db8fc59326))
* **scripts:** useless ([66d08c1e](https://github.com/AncientSouls/GraphSpreading/commit/66d08c1e24a1f13dc76ac4d7519ac0044f59e04f))
* **async:** Move callback from push to drain ([9385fa0a](https://github.com/AncientSouls/GraphSpreading/commit/9385fa0a9e9554c578fd5d9daa1844e8b6008ddb))
* **package:** Not need to compile after install ([fc4c20f0](https://github.com/AncientSouls/GraphSpreading/commit/fc4c20f0cae3604ed305c0a5bdc511b420645d04))
* **readme:** npm run compile already in npm test ([b935e5c5](https://github.com/AncientSouls/GraphSpreading/commit/b935e5c5a8af9c535c11908cb0fb17bdcd17785e))
* **spreader:** Spread links handler without path fetching. ([7c024654](https://github.com/AncientSouls/GraphSpreading/commit/7c0246543aafdfcc45175aa62dad4032ea4e561f))
* **ignore:** src/lib/tests ([81745402](https://github.com/AncientSouls/GraphSpreading/commit/8174540215e2d06c1fd9512f0bffb2e697f9e677))

##### Refactors

* **names:** Fix old renaming ([0a1c2e63](https://github.com/AncientSouls/GraphSpreading/commit/0a1c2e63effa807206c83f46cb2dd0d7d28af319))
* **queue:** Rename mayBeEndedLaunched to removeFromLaunched ([f845211b](https://github.com/AncientSouls/GraphSpreading/commit/f845211b03dddc1136ba1a5accc51d62709891c4))

