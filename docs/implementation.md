# How it works

## Web Worker Communication

The Web Worker API is used to process data captured in the UI. 
There is a specific protocol that must be followed when utilizing the worker's functionality. 

The main web worker is created in the main view file (animationCreator.view.js) and attached
to the view as SubProcess. 

Messages that are sent to SubProcess use the worker's postMessage method. Specific instruction 
is specified in an object literal:

    ```
    {
        message: <string>, // the message corresponding to a message trigger in the worker js file
        workerData: <object> // (optional) any object that the worker needs to do work. 
    }

    ```

## General Architecture

The application is divided into two parts: the main axes, and a tool kit. The main axes is a 
large portion of the screen devoted to direct x-y manipulation. It is currently rendered in 
HTML canvas; however, it is possible to render it in other forms, like SVG DOM elements. 
The tool kit is a collection of objects each with a view and model pair. It is used to hold 
additional ui gadgets for user manipulation and access to application functionalities. 

