import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import "./Scanner.css";

function Scanner() {
  const [scanResult, setScanResult] = useState(null);
  const [accessGranted, setAccessGranted] = useState(false);

  // Declare currentDate variable
  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 275,
        height: 275
      },
      fps: 5,
    });

    scanner.render(success, error);

    function success(result){
      scanner.clear();
      setScanResult(result);

      // Extract data from the QR code output
      const dateMatch = result.match(/Date: (\d{4}-\d{2}-\d{2})/);
      const startPlaceMatch = result.match(/Start Place: ([^\n]+)/);
      const destinationPlaceMatch = result.match(/Destination Place: ([^\n]+)/);

      if (dateMatch) {
        const qrDate = dateMatch[1]; // Extracted date from the QR code
        const startPlace = startPlaceMatch ? startPlaceMatch[1].trim() : '';
        const destinationPlace = destinationPlaceMatch ? destinationPlaceMatch[1].trim() : '';

        // Check if either start place or destination is "colombo fort"
        const accessGranted = qrDate === currentDate && (startPlace === 'colombo fort' || destinationPlace === 'colombo fort');

        setAccessGranted(accessGranted);
      }
    }

    function error(err) {
      console.warn(err);
    }

    
  }, [currentDate]);

  return (
    <div className="scanner-container">
      {scanResult ? (
        <div className="success">
          Success: <a href={`http://${scanResult}`}>{scanResult}</a>
          {accessGranted ? (
            <div className="access-granted">Access Granted</div>
          ) : (
            <div className="not-access">Not Access</div>
          )}
        </div>
      ) : (
        <div id="reader"></div>
      )}
    </div>
  );
}

export default Scanner;
