"use client"
import React, { useEffect } from 'react'
import { io } from "socket.io-client";

let socket = io("http://localhost:4000");

const page = () => {

    useEffect(() => {
        socket.on("addToCart", (data) => {
            console.log(data);
        });
    }, []);

  return (
    <div>page</div>
  )
}

export default page