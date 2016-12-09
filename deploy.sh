#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="travis-test"
TARGET_BRANCH="dist"

#$1 - branch
#$2 - folder
function compileBuild {
     # Run our compile script
     git fetch origin $1
     git checkout $1 || git checkout --orphan $1
     npm install
     bower install
     gulp build

     [ -d dist/$2 ] || mkdir -p dist/$2
     cp -r build/ dist/$2
     cp -r index.html dist/$2
     rm -f dist/build/$2/*.map
     rm -f build/**/*
}

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Create and clone compiled emscripten
git clone https://github.com/urho3d/emscripten-sdk.git emscripten
cd ./emscripten/emscripten
./emsdk activate latest
cd ../..

make -f Makefile.emscripten
exit 0

# Clone the existing gh-pages for this repo into dist/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
git clone $REPO dist
cd dist
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cd ..

# Clean dist existing contents
rm -rf dist/**/* || exit 0

compileBuild $SOURCE_BRANCH .

# Now let's go have some fun with the cloned repo test

cd dist
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if [ -z "git diff --exit-code" ]; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi


# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add --all
git commit -m "Deploy to GitHub Pages: ${SHA}"

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in ./../deploy_key.enc -out deploy_key -d
chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key

# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH