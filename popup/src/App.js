import React, {useState, useEffect} from 'react';
import Header from "./components/Header";
import Event from "./components/Event";

function App() {
    let [events, setEvents] = useState(null);

    useEffect(() => {
        /* eslint-disable no-undef */
        // requests the events upon opening the popup
        browser.tabs.query({active: true, currentWindow: true}, tabs => {
            const sending = browser.runtime.sendMessage({type: "getEvents", tabId: tabs[0].id});
            sending.then(events => {
                setEvents(events);
            }, error => {
                console.log("Couldn't retrieve data:", error);
            });
        });

        // listens for new events when popup is already open
        browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
            browser.tabs.query({active: true, currentWindow: true}, tabs => {
                if (message.type === "newEvent") {
                    const thisTabEvents = message.events.find(event => {
                        return event.tabId === tabs[0].id
                    })
                    if (thisTabEvents) {
                        setEvents(thisTabEvents.events);
                    }
                } else {
                    console.error("Unrecognised message: ", message);
                }
            })
        });
        /* eslint-disable no-undef */
    }, []);

    return (
        <div className="bodyClass">
            <Header/>
            <div className="eventBody">
                {events ? events.map(event => {
                    return <Event event={event}/>
                }) : "Nothing to show"}
            </div>
        </div>
    );
}

export default App;
