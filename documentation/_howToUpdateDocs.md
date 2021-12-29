# How To Update Documentation

###### Skip to the end if you want..

DocumentationJS 'works' with Typescript... But not particularly well. As such the way to update the docs is a little wonky, and you have to run through them TS file by TS file.

As such, here are the files that have documentation and the commands that should be run.

`documentation build integration.ts --parse-extension ts -f md -o documentation/integration --shallow`
`documentation build lit.ts --parse-extension ts -f md -o documentation/lit --shallow`
`documentation build ceramic.ts --parse-extension ts -f md -o documentation/ceramic --shallow`
`documentation build client.ts --parse-extension ts -f md -o documentation/client --shallow`

### But wait, there's more!!!!

There's a convenience script that has been made to do all of these at once:
`yarn build:docs`
