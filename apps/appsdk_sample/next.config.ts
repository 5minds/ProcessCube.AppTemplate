const { withApplicationSdk } = require('@5minds/processcube_app_sdk/server');

module.exports = withApplicationSdk({
  serverExternalPackages: ['esbuild'],
  applicationSdk: {
    useExternalTasks: true,
  },
});
