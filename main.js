//director=cc.Director.getInstance();

var cocos2dApp = cc.Application.extend({
    config:document['ccConfig'],
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },
    applicationDidFinishLaunching:function () {
        // initialize director
        var director = cc.Director.getInstance();

        cc.EGLView.getInstance()._adjustSizeToBrowser();
        var screenSize = cc.EGLView.getInstance().getFrameSize();
        var resourceSize = cc.size(480, 800);
        var designSize = cc.size(480, 800);

        var searchPaths = [];
        var resDirOrders = [];

        cc.FileUtils.getInstance().setSearchPaths(searchPaths);

        var platform = cc.Application.getInstance().getTargetPlatform();
        resourceSize = cc.size(320, 480);
        designSize = cc.size(320, 480);

        director.setContentScaleFactor(resourceSize.width / designSize.width);
        cc.EGLView.getInstance().setDesignResolutionSize(designSize.width, designSize.height, cc.RESOLUTION_POLICY.SHOW_ALL);
        cc.EGLView.getInstance().resizeWithBrowserSize(false);//important

        //director.setDisplayStats(this.config['showFPS']);
		director.setDisplayStats(false);
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        //load resources  (empty)
        cc.LoaderScene.preload([], function () {
            director.replaceScene(new this.startScene());
        }, this);

        return true;
    }
});

var myApp = new cocos2dApp(MyScene);


