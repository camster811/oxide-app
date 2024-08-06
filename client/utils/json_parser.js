const jsonParse = (data) => {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error("Invalid JSON data");
      return data;
    }
  }

  const processObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "string" && obj[key].includes(",")) {
        obj[key] = obj[key].split(",").map((item) => item.trim());
      } else if (typeof obj[key] === "object") {
        processObject(obj[key]);
      }
    }
  };

  processObject(data);
  return data;
};

export default jsonParse;
