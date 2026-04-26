/**
 * Sonos System — Beam soundbar + Sonos One speakers.
 * Used by: 7-suburb (Beam connected to Samsung Frame TV + 2 Sonos One speakers).
 *
 * Note: This component is the generic Sonos guide; per-property speaker
 * inventory and physical placement live in the property's own MDX
 * around this component when needed.
 */

export function SonosSystem() {
  return (
    <>
      <h3>Sonos System</h3>
      <p>
        <a
          href="https://www.sonos.com/en-us/support/by-product"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sonos support
        </a>
      </p>

      <h4>Getting started</h4>
      <ol>
        <li>The Sonos system is always powered on and ready.</li>
        <li>Download the Sonos App (iOS or Android).</li>
        <li>Connect your device to the house Wi-Fi.</li>
        <li>
          Open the Sonos App. When prompted, select <em>Use a system that&apos;s already set up</em> — the app auto-detects the house&apos;s system.
        </li>
        <li>You now have control of every Sonos speaker in the house.</li>
      </ol>

      <h4>Basic controls</h4>
      <ul>
        <li><strong>Browse:</strong> music services, radio, podcasts.</li>
        <li><strong>Rooms:</strong> view individual speakers or group them.</li>
        <li><strong>Search:</strong> find songs, artists, albums, playlists.</li>
        <li><strong>Settings:</strong> advanced features.</li>
      </ul>

      <h4>Volume</h4>
      <ul>
        <li>Slider in the app — control individual speakers or grouped speakers together.</li>
        <li>Physical volume buttons on each Sonos One speaker.</li>
        <li>When the TV is on, control the Beam volume with the TV remote.</li>
      </ul>

      <h4>Streaming</h4>
      <p>
        Browse → Spotify / Apple Music / Amazon Music / etc. Log in to your
        personal account if prompted. Music plays through your selected
        speaker(s).
      </p>

      <h4>AirPlay (Apple devices)</h4>
      <ol>
        <li>Connect your iPhone/iPad/Mac to the house Wi-Fi.</li>
        <li>Open Control Center, tap the AirPlay icon.</li>
        <li>Select the Sonos speaker(s).</li>
        <li>Play audio from any app.</li>
      </ol>

      <h4>Cast (Android)</h4>
      <ol>
        <li>Connect to the house Wi-Fi.</li>
        <li>Open your media app, tap the Cast icon, select Sonos.</li>
      </ol>

      <h4>Spotify Connect</h4>
      <p>
        In the Spotify app, play a song → <em>Devices Available</em> → select
        a Sonos speaker.
      </p>

      <h4>Bluetooth (Sonos One)</h4>
      <ol>
        <li>Press and hold the Play/Pause button on the back of a Sonos One.</li>
        <li>Wait for the chime + flashing blue light (pairing mode).</li>
        <li>Pair from your device&apos;s Bluetooth settings.</li>
      </ol>

      <h4>TV audio</h4>
      <ul>
        <li>The Beam auto-detects when the TV is on.</li>
        <li>TV audio plays through the Beam soundbar.</li>
        <li>Volume controlled by the TV remote.</li>
        <li>Enhanced sound: Sonos app → Settings → System → Beam.</li>
      </ul>

      <h4>Switching between TV and music</h4>
      <ul>
        <li>TV audio takes priority when the TV is on.</li>
        <li>Use the Sonos app to play music while the TV is on.</li>
        <li>Stop music in the app to return to TV audio.</li>
      </ul>

      <h4>Troubleshooting</h4>
      <ul>
        <li>Confirm the device is on the house Wi-Fi; restart the app.</li>
        <li>Check that all Sonos speakers have power (solid white light).</li>
        <li>Speaker not responding: power-cycle (unplug 10 s, plug back in).</li>
        <li>Audio quality: move closer to the Wi-Fi router; close bandwidth-heavy apps.</li>
      </ul>

      <h4>When leaving</h4>
      <p>No formal shutdown — stop music when finished. Standby is automatic.</p>
    </>
  );
}
