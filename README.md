# AcesGoPlaces 最佳拍檔 (導演 & 演員)
A react-d3 data visualization of HK film industry from 1920-2010.
There are always 最佳拍檔 in filmmaking business, not only among actors, but between directors and actors, I believe the chemistry can be stronger. In this program, I would like to use a basic network graph to visualize the work relationship among the Hong Kong directors and actors throughout the years. 

## Dataset
The dataset is retrieved from Hong Kong Film Archive. It is a pdf file including all the films that were screened in Hong Kong from 1920-2010. The pdf file has been cleaned and the structured data can be found in ./data/transform/film.txt.

## Visualization
The director-actor connections are visualized using d3 force simulation. Each node color represents if the person is a director/actor, or both. The top 20 directors/actors with the most connections are highlighted in red circles.
![screenshot1]
(./screenshots/1.png)

## Features
To help understanding the data further, the following features have been implemented:
1. Search: search for a director/actor with a chinese name and the search will be highlighted with green name
![screenshot2](/screenshots/2.png)
2. Find related connections by clicking on the name: click on the names and the directors/actors who are related will be highlighted with a blue name
![screenshot3](/screenshots/3.png)
3. Films that are worked by a director/actor pair: multi-select 2 names (by holding on the command key) and a list of films, if any, that were worked by the pair will be displayed
![screenshot4](/screenshots/4.png)

## Conclusion & Future works
Performance is the main issue in rendering the graph. When there are thousands of connections, it may take a while for the graph to finish rendering. I have tried using bubble chart to represent the connections. Compared to force graph, I found that force graph can better show the complexity of human network. 

How can we define a top working relationship? Does it count by the connections we have made, like what has done in this program. I have doubted it. Take an example of the awarded movies Wong Kar Wai and Tong Leung made in the 90's. The public would think that they are a good pair of working partners. However, the pair does not show as the top in the graph. It implies the quantitative definition of the connection's weight (by how many films the pair has made) is not sufficient. To move forward, more data such as award list, can be pulled in for the weight calculation.


