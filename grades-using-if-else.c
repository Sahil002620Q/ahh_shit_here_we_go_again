#include <stdio.h> 
int main () {
     int x;
     printf("\nenter grade : \n");
     scanf("%d",&x);
     printf("you got ");
     if(x<=30){
        printf("fail");
     }else if(x<=70){
        printf(" B grade");
     }else if(x<=80){
        printf(" B+ grade");
     }else if(x<=90){
        printf(" A grade");
     }else if(x<=100){
        printf(" A+ grade");
     }else{
        printf("an error ");
     }
     
  //ladder if else


}
