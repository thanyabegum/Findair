# Findair - Find Cheap Flights

Hosted on GitHub Pages, Findair is a React web application using Skyscanner API that helps travelers find the cheapest flight for their travel needs.
Find your next flight at https://thanyabegum.github.io/Findair/

## Installation

In the command line, run the following commands to obtain your own copy of Findair:

1. Clone the repository with `git clone https://github.com/thanyabegum/Findair/`
2. Change the current directory to Findair using `cd Findair`
3. Run `npm install` to install the necessary packages
4. Create a `.env` file in the Findair directory containing `REACT_APP_API_KEY=<sky-scanner-api-key>` where `<sky-scanner-api-key>` is replaced by your SkyScanner API key wrapped in double quotes ("").

Now you'll be able to make Findair your own. See your changes by running `npm start` in the command line and going to `localhost:3000` in a browser.

## Features

A few of the things you can do with Findair are:

- Set your origin and destination using searchable dropdowns
- Pick between Roundtrip or One Way trip types so you know exactly when you're departing and returning
- Choose the currency of your flight prices if USD isn't your first choice
- Sort your flight results by price and see them update in realtime

## What's Next?

Despite all of Findair's amazing features, there's still more to do! In particular:

- Add more details to flight results (e.g. origin, destination, time)
- Include additional error handling
- Ensure Findair is accessible and mobile responsive
- Allow for swapping origin and destination or vice versa
- Style inputs with icons (e.g. location pin, calendar icon)
- Customize origin and destination dropdown options to include details about region/city
