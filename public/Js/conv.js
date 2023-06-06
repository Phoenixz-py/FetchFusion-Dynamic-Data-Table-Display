fetch("http://localhost:3000/results")
        .then((response) => response.json())
        .then((data) => {
          const resultsTableBody = document.getElementById("results-table-body");

          const topResults = data.slice(0, 5);

          topResults.forEach((result, index) => {
            const row = document.createElement("tr");
            const numberCell = document.createElement("td");
            numberCell.textContent = index + 1;
            const nameCell = document.createElement("td");
            nameCell.textContent = result.name;
            const lastCell = document.createElement("td");
            lastCell.textContent = result.last;
            const buySellCell = document.createElement("td");
            buySellCell.textContent = result.buy + " / " + result.sell;

            const difference = result.buy - result.sell;
            const differenceCell = document.createElement("td");
            differenceCell.textContent = difference.toFixed(2);
            differenceCell.style.color = difference >= 0 ? "#5dc7c2" : "red";

            const volumeCell = document.createElement("td");
            volumeCell.textContent = result.volume;

            row.appendChild(numberCell);
            row.appendChild(nameCell);
            row.appendChild(lastCell);
            row.appendChild(buySellCell);
            row.appendChild(differenceCell);
            row.appendChild(volumeCell);
            resultsTableBody.appendChild(row);
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });