# Dependency patches

` +9.3.1.patch` fixes Android compilation with React
Native 0.83.1, which no longer includes `GuardedResultAsyncTask`. It uses the
available `GuardedAsyncTask` and resolves the promise after metadata and file
copy processing finishes on the background thread.

The `postinstall` script applies this patch after installing dependencies.
Keep the patch until the document picker is upgraded or replaced with a
compatible version. When regenerating it, exclude generated Android files:

```sh
npx patch-package react-native-document-picker --include 'android/src/.*'
```

Verify with `cd android && ./gradlew app:assembleDebug`.
