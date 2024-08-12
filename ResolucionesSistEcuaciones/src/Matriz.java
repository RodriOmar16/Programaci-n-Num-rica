
import java.util.Scanner;

public class Matriz {
	public double matrizCoef[][];
	public double termIndep[][];
	public int orden[] = new int[2];
	public double[][] L, U;
	
	public Matriz(int n, int m) {
		this.matrizCoef = new double[n][m];
		this.termIndep  = new double[n][1];
		this.orden[0]	= n; //filas
		this.orden[1]	= m; //columnas
		//siempre que n = m
		this.L = new double[n][n];
		this.U = new double[n][n];
	}
	
	//GETTERS AND SETTERS
	public double[][] getMatrizCoef(){
		return this.matrizCoef;
	}
	public void setMatrizCoef(double[][] a, int n, int m) {
		this.orden[0] = n;
		this.orden[1] = m;
		this.matrizCoef = new double[n][m];
		
		for(int f=0; f<n ;f++) {
			for(int c=0; c<m ;c++) {
				this.matrizCoef[f][c] = a[f][c];
			}
		}
	}
	
	public double[][] getMatrizTermIndep(){
		return this.termIndep;
	}
	public void setMatrizTermIndep(double[][] a, int n){
		this.termIndep = new double[n][1];
		for(int f=0; f<n ;f++) {
			this.termIndep[f][1] = a[n][1];
			
		}
	}
	
	private double[][] getMatrizAmpliadaInterno(double a[][], int n, int m, double b[][]){
		int /*n = this.orden[0], m = this.orden[1],*/ f,c;
		double A[][] = new double[n][m+1];
		
		for(f=0; f<n ;f++) {
			for(c=0; c<m ;c++) {
				A[f][c] = a[f][c]; 
			}
			A[f][c] = b[f][0];
		}
		return A;
	}
	public double[][] getMatrizAmpliada(){
		return getMatrizAmpliadaInterno(this.matrizCoef, this.orden[0], this.orden[1], this.termIndep);
	}
	
	public int[] getOrden() {
		return this.orden;
	}
	
	public double[][] getL(){
		return this.L;
	}
	public void setL(double a[][], int n){
		for(int f=0; f<n ;f++) {
			for(int c=0; c<n ;c++) {
				this.L[f][c] = a[f][c];
			}
		}
	}
	
	public double[][] getU(){
		return this.U;
	}
	public void setU(double a[][], int n){
		for(int f=0; f<n ;f++) {
			for(int c=0; c<n ;c++) {
				this.U[f][c] = a[f][c];
			}
		}
	}
	
	//-----------------------------------------------------------------------------------------------------------
	
	public void cargarMatriz() {
		Scanner teclado = new Scanner(System.in);
		int n = this.orden[0], m = this.orden[1],f,c;
		
		for(f=0; f<n ;f++) {
			for(c=0; c<m ;c++) {
				System.out.print("Ingresar elem. ["+(f+1)+"]["+(c+1)+"]: ");
				this.matrizCoef[f][c] = teclado.nextDouble();
			}
			System.out.print("Ingresar término independiente ["+(f+1)+"]["+(c+1)+"]: ");
			this.termIndep[f][0] = teclado.nextDouble();
		}
		
		teclado.close();
	}
	
	private void mostrarMatrizCoef(double a[][], int n, int m) {
		System.out.println("\nMuestra de la matriz de coeficientes: ");
		for(int f=0; f<n ;f++) {
			System.out.println();
			for(int c=0; c<m ;c++) {
				System.out.print(a[f][c]+"\t");
			}
		}
	}
	private void mostrarTerminosIndep(double b[][], int n) {
		System.out.println("\nMuestra de los términos independientes: \n");
		for(int c=0; c<n ;c++) {
			System.out.println(""+b[c][0]);
		}
	}
	private void mostrarMatrizAmpliada(double a[][], int n, int m) {
		int c;
		System.out.println("\nMuestra de la matriz de ampliada: ");
		for(int f=0; f<n ;f++) {
			System.out.println();
			for(c=0; c<m ;c++) {
				if(c != m-1) {
					System.out.print(a[f][c]+"\t");
				}else System.out.print(a[f][c]+"");
			}
			System.out.print(" | "+a[f][c]+"\t");
		}
	}
	//mostrar matriz en sus distintas formas
	public void mostrarMatriz(int opc) {
		int f,c,n ,m;
		switch(opc) {
			case 1: //matriz de coef
				n = this.orden[0]; m = this.orden[1];
				mostrarMatrizCoef(this.matrizCoef,n,m);
				break;
			case 2: //terminos indep
				n = this.orden[0];
				mostrarTerminosIndep(this.termIndep,n);
				break;
			default: //ampliada
				n = this.orden[0]; m = this.orden[1];
				System.out.println("\nMuestra de la matriz de ampliada: ");
				for(f=0; f<n ;f++) {
					System.out.println();
					for(c=0; c<m ;c++) {
						if(c != m-1) {
							System.out.print(this.matrizCoef[f][c]+"\t");
						}else System.out.print(this.matrizCoef[f][c]+"");
					}
					System.out.print(" | "+this.termIndep[f][0]+"\t");
				}
		}
		System.out.print("");
	}
		
	//CALCULA LA NORMA 1 DEL VECTOR
	private double norma1Vector(double x[], int n) {
		double acu = 0;
		for(int i=0; i<n ;i++){
			acu += Math.abs(x[i]);
		}
		return acu;
	}
	//CALCULA LA NORMA 2 o EUCLIADEA DEL VECTOR
	private double norma2Vector(double x[], int n) {
		double acu = 0;
		for(int i=0; i<n ;i++){
			acu += Math.pow(x[i],2);
		}
		return Math.sqrt(acu);
	}
	//CALCULA LA NORMA INFINITO DEL VECTOR
	private double normaInfinitoVector(double x[], int n) {
		double may = Math.abs(x[0]);
		for(int i=1; i<n ;i++){
			if(Math.abs(x[i]) > may) {
				may = Math.abs(x[i]);
			}
		}
		return may;
	}
	
	//CALCULA LA NORMA DE FROBENIUS O EUCLIDEA DE LA MATRIZ
	private double normaFrobeniusMatriz(double a[][], int n, int m) {
		double acu = 0;
		for(int i=0; i<n ;i++) {
			for(int j=0; j<m ;j++) {
				acu += Math.pow(a[i][j],2);
			}
		}
		
		return Math.sqrt(acu);
	}
	//CALCULA LA NORMA DE FROBENIUS O EUCLIDEA DE LA MATRIZ
	private double norma1Matriz(double a[][], int n, int m) {
		double may, acu = 0;
		for(int i=0; i<n ;i++) {
			acu += Math.abs(a[i][0]);
		}
		may = acu;
		
		for(int j=1; j<m ;j++) {
			acu = 0;
			for(int i=0; i<n ;i++) {
				acu += Math.abs(a[i][j]);
			}
			if(acu > may) {
				may = acu;
			}
		}
		return may;
	}
	//CALCULA LA NORMA DE FROBENIUS O EUCLIDEA DE LA MATRIZ
	private double normaInfinitoMatriz(double a[][], int n, int m) {
		double may, acu = 0;
		for(int j=0; j<m ;j++) {
			acu += Math.abs(a[0][j]);
		}
		may = acu;
		
		for(int i=1; i<n ;i++) {
			acu = 0;
			for(int j=0; j<m ;j++) {
				acu += Math.abs(a[i][j]);
			}
			if(acu > may) {
				may = acu;
			}
		}
		return may;
	}
	
	//Comprueba si es triangular superior o no
	private boolean esTriangularSuperior(double [][]a, int n, int m) {
		boolean cumple = true;
		int f=1,c;
		while(f<n && cumple){
			c=0;
			while(c<f && a[f][c]==0){
				c++;
			}
			if(c<f) {
				cumple = false;
			}
			f++;
		}
		return (cumple == true);
	}
	//Comprueba si es triangular inferior o no
	private boolean esTriangularInferior(double [][]a, int n, int m) {
		boolean cumple = true;
		int f=0,c;
		while(f<n && cumple){
			c=f+1;
			while(c<m && a[f][c]==0){
				c++;
			}
			if(c<m){ cumple = false; }
			f++;
		}
		return (cumple == true);
	}
		
	private double deno_det(double[][] A, int n){ //calcula el denominador de la formula de gauss para calc. del det
		double acu=1,cont=0;
		for(int c=0; c<n ;c++){
			cont = (n-1)-c;
			acu=acu*Math.pow(A[c][c],cont);
		}
		return acu;
	}
	private double met_Gauss(double[][] A, int n){//Metodo de Gauss para el det
		Matriz Aux = new Matriz(n,n);
		//copia A en Aux
		Aux.setMatrizCoef(A, n, n);		
		Aux.factorizacionLUgauss();
				
		double detE = determinante(Aux.getU(),n, n, 0,1);
		return detE;///deno_det(Aux.getU(), n);
	}
	private double met_Sarrus(double[][] A){//Método de la regla de Sarrus
		return ((A[0][0]*A[1][1]*A[2][2])+(A[0][1]*A[1][2]*A[2][0])+(A[0][2]*A[1][0]*A[2][1])) + (-(A[0][2]*A[1][1]*A[2][0])-(A[0][0]*A[1][2]*A[2][1])-(A[0][1]*A[1][0]*A[2][2]));
	}
	
	
	private double[][] menor_corres(double A[][],int n,int filk,int colk){ //calcula el menor correspondiente
		double[][] M = new double[n-1][n-1];	int i=0,j,b=0,f,c, filas = n-1, columnas = filas;
		
		for(f=0;f<n;f++){
			j=0;
			for(c=0;c<n;c++){
				if(c!=colk && f!=filk){
					M[i][j]=A[f][c];
					j++;	b=1;
				}
			}
			if(b==1){
				i++; b=0;
			}
		}
				
		return M;
	}
	private double cofactor(double[][] A,int cant,int filk,int colk){ //calcula el cofactor correspondiente a un elemento
		int signo=1,n=colk+filk;	double M[][] = new double[cant-1][cant-1]; 
		M=menor_corres(A,cant,filk,colk);
		for(int i=0;i<n;i++){	signo=signo*(-1);	}
		return signo*determinante(M,cant-1,cant-1,2,1);
	}
	private double des_Laplace(double[][] A,int n,int fila){//Método del desarrollo de Laplace
		int k;	double acu=0;
		for(k=0;k<n;k++){	acu=acu+A[fila][k]*cofactor(A,n,fila,k); }
		return acu;
	}
	
	//DETERMINANTE
	private double determinante(double [][]A, int n, int m, int caso,int fila){ //fila es para el desarrollo de laplace
		double det = 0;
		if(n==2 && m==2){	return A[0][0]*A[1][1] - A[1][0]*A[0][1]; }
		else{
			boolean esTs = esTriangularSuperior(A,n,m) , esTi = esTriangularInferior(A,n,m);
			if(n==3 && m==3){
				det=met_Sarrus(A);
			}else {
				if(esTs || esTi){//pregunta si es triangular
					det=1;
					for(int c=0;c<n;c++){	det*=A[c][c];	} //producto de la diagonal principal
				}else{
					switch(caso){
						case 1:	det=met_Gauss(A, n);	break; //FALTA REVISAR
						case 2:	det=des_Laplace(A, n,fila);	break;
					}
				}
			}
			return det;
		}
	}
	public double detMatriz(int caso) {
		return determinante(this.matrizCoef,this.orden[0], this.orden[1], caso, 0); 
	}
	//RESOLUCION DE SISTEMAS DIAGONAL
	public double[] resolucionSistDiagonal() {
		int n = this.orden[0];
		double x[] = new double[n];
		for(int i=0; i<n ;i++) {
			x[i] = this.termIndep[i][0]/this.matrizCoef[i][i];
		}
		return x;
	}
	//RESOLUCION DE SISTEMAS TRIANGULARES SUPERIORES
	public double[] resolucionSistTriangularSuperior(double A[][], int n, double b[][]) {
		//int n = this.orden[0];
		double x[] = new double[n];
		//if(esTriangularSuperior(A, n, n)) {
			double acu = 0;
			x[n-1] = (b[n-1][0] - acu )/A[n-1][n-1];
			
			for(int f=n-2; f>=0 ;f--) {
				acu = 0; 
				for(int c=n-1; c>f ;c--) {
					acu = acu + A[f][c] * x[c];
				}
				x[f] = (b[f][0] - acu)/A[f][f];
			}			
			
		/*}else {
			System.out.println("El sistema no es triangular Superior.");
		}*/
		return x;
	}
	//RESOLUCION DE SISTEMAS TRIANGULARES INFERIORES
	public double[] resolucionSistTriangularInferior(double A[][], int n, double b[][]) {
		//int n = this.orden[0];
		double x[] = new double[n];
		if(esTriangularInferior(A, n, n)) {
			double acu = 0;
			x[0] = (b[0][0] - acu)/A[0][0];
			for(int f=1; f<n ;f++) {
				acu = 0;
				for(int c=0; c<f ;c++) {
					acu = acu + A[f][c] * x[c];
				}
				x[f] = (b[f][0] - acu)/A[f][f];
			}
			
		}else {
			System.out.println("El sistema no es triangular Inferior.");
		}
		return x;
	}

	public boolean condNSFactorizacion() {
		boolean resp = true;
		return resp;
	}
	
	//FACTORIZACIÓN LU
	public void factorizacionLU(){
		int n = this.orden[0],
				i, j;
		double acu = 0, sum = 0;
		
		for(i=0; i<n ;i++) {
			for(j=i; j<n ;j++) {
				acu  = 0;
				for(int k=0; k<=(i-1) ;k++) {
					acu = acu + L[i][k]*U[k][j];
				}
				
				U[i][j] = this.matrizCoef[i][j] - acu ;
				
				if(i==j) {
					L[i][i] = 1;
				}else {
					sum = 0;
					for(int k=0; k<=(i-1) ;k++) {
						sum += L[j][k]*U[k][i];
					}
					L[j][i] = (this.matrizCoef[j][i] - sum)/U[i][i];
				}
			}
		}
	}
	
	//PIVOTEO NORMAL
	private double[][] pivotearNormal(double A[][], int n, int m, int k) {
		double aux, a[][] = new double [n][m];
		int fila=k+1, col;
		
		for(int f=0; f<n ;f++) {
			for(int c=0; c<m ;c++) {
				a[f][c] = A[f][c];
			}
		}
		
		while(fila<n && a[fila][k] != 0) {
			fila++;
		}fila--;
		for(col=0; col<m ;col++) {
			aux			 = a[fila][col];
			a[fila][col] = a[k][col];
			a[k][col] 	 = aux;
		}
		return a;
	}
	//PIVOTEO PARCIAL
	private double[][] pivotearParcial(double A[][], int n, int m, int k) {
		double aux, a[][] = new double [n][m], may;
		int fila, col;
		//copio la matriz, porque a veces no me toma los cambios sobre A, por eso a
		for(int f=0; f<n ;f++) {
			for(int c=0; c<m ;c++) {
				a[f][c] = A[f][c];
			}
		}
		//determino de la sub-matriz, k para abajo cual es el mayo 
		may = Math.abs(a[k][k]); fila=k;
		for(int i=k; i<n; i++) {
			if( Math.abs(a[i][k]) > may) {
				may =  Math.abs(a[i][k]);
				fila = i;
			}
		}
		
		//realizo el intercambio de las filas
		for(col=0; col<m ;col++) {
			aux			 = a[fila][col];
			a[fila][col] = a[k][col];
			a[k][col] 	 = aux;
		}
		return a;
	}
	//PIVOTEAR COMPLETO
	private double[][] pivotearCompleto(double A[][], int n, int m, int k) {
		double aux, a[][] = new double [n][m], may;
		int fila, columna, col, interCol = 0, interFila = 0;
		//copio la matriz, porque a veces no me toma los cambios sobre A, por eso a
		for(int f=0; f<n ;f++) {
			for(int c=0; c<m ;c++) {
				a[f][c] = A[f][c];
			}
		}
		//determino de la sub-matriz, k para abajo cual es el mayo 
		may = Math.abs(a[k][k]); fila=k; columna = k;
		for(int i=k; i<n; i++) {
			for(int j=k; j<n ;j++) {
				if(Math.abs(a[i][j]) > may) {
					may 	=  Math.abs(a[i][j]);
					fila 	= i;
					columna = j;
					interCol = 1;
					interFila = 1;
				}
			}
		}
		if(interCol != 0) {
			//realizo el intercambio de las columnas
			for(int f=k; f<n ;f++) {
				aux			 = a[f][columna];
				a[f][columna] = a[f][k];
				a[f][k] 	 = aux;
			}
		}
		if(interFila != 0){
			//realizo el intercambio de las filas
			for(col=0; col<m ;col++) {
				aux			 = a[fila][col];
				a[fila][col] = a[k][col];
				a[k][col] 	 = aux;
			}
		}
		return a;
	}
	
	//FACTORIZACION LU POR GAUSS
	public void factorizacionLUgauss() {
		int n = this.orden[0];
		//copiar matriz A en U
		for(int f=0; f<n ;f++) {
			for(int c=0; c<n ;c++) {
				this.U[f][c] = this.matrizCoef[f][c];
			}
		}
		//inicio el proceso de factorizacion
		for(int k=0; k<n-1;k++) {
			this.L[k][k] = 1;
			
			if(this.U[k][k] == 0) {
				U = pivotearNormal(U, n,n, k);
			}
			
			for(int i=k+1; i<n ;i++) {
				this.L[i][k] = (this.U[i][k])/(this.U[k][k]);
				this.U[i][k] = 0;
				
				for(int j=k+1; j<n ;j++) {
					this.U[i][j] = this.U[i][j] - this.L[i][k] * this.U[k][j]; 
				}
			}
		}
		this.L[n-1][n-1] = 1;
	}
	//ELIMINACIÓN GAUSSIANA
	public double[] eliminacionGaussiana() {
		int n = this.orden[0], c;
		double x[] = new double[n], G[][] = new double[n][n+1], aux[][] = new double[n][1], m;
		
		//Copia A y B talque G = (A|b)
		G = getMatrizAmpliadaInterno(this.matrizCoef, n, n, this.termIndep);
		
		//Comienza la eliminación
		for(int k=0; k<n-1 ;k++) {
			//realizo privoteo de ser necesario
			/*if(G[k][k] == 0){
				G = pivotearNormal(G,n,n+1, k);
			}*/
			//G = pivotearParcial(G,n,n+1, k);
			G = pivotearCompleto(G,n,n+1, k);
			for(int i=k+1; i<n ;i++) {
				m = (G[i][k])/(G[k][k]);
				G[i][k] = 0;
				
				for(int j=k+1; j<=n ;j++) {
					G[i][j] = G[i][j] - (m * G[k][j]);
				}
			}
		}
		//uso a x como auxiliar
		for(int f=0; f<n ;f++) {
			aux[f][0] = G[f][n];
		}
		
		//realizo Sustitucion regresiva
		x = resolucionSistTriangularSuperior(G, n, aux);
		
		mostrarMatrizAmpliada(G, n,n);	
		
		return x;
	}
	//GAUSS-JORDAN
	public double[] gaussJordan(){
		int n = this.orden[0], c;
		double x[] = new double[n], 
				G[][] = new double[n][n+1],m;
		
		//Copia A y B talque G = (A|b)
		G = getMatrizAmpliadaInterno(this.matrizCoef, n, n, this.termIndep);
						
		//comienzo el proceso
		for(int k=0; k<n ;k++) {
			//realiza pivoteo de ser necesario
			if(G[k][k] == 0){
				G = pivotearNormal(G,n,n+1, k);
			}
			
			for(int j=k+1; j<=n ;j++) {
				G[k][j] = G[k][j]/G[k][k];
			}
			G[k][k] = G[k][k]/G[k][k];
						
			for(int i=0; i<n ;i++) {
				if(i!=k) {
					m = G[i][k]/G[k][k];
					for(int j=k; j<=n ;j++) {
						G[i][j] = G[i][j] - m * G[k][j];
					}
				}
			}
		}
		
		for(int i=0; i<n ;i++) {
			x[i] = G[i][n];
		}
		
		mostrarMatrizAmpliada(G, n,n);
		
		return x;
	}
	
	//CRUT L1U
	public double[] croutL1U() {
		int n = this.orden[0], 
			c;
		double x[] 	   = new double[n],
			   G[][]   = new double[n][n+1],
			   aux[][] = new double[n][1],
			   acu     = 0;
		
		//Copia A y B talque G = (A|b)
		G = getMatrizAmpliadaInterno(this.matrizCoef, n, n, this.termIndep);
		
		//Comienza el proceso de Factorización A = L1 * U
		for(int k=0; k<n ;k++) {
			for(int j=k; j<=n ;j++) {
				acu = 0;
				for(int p=0; p<k ;p++) {
					acu = acu + (G[k][p] * G[p][j]);
				}
				G[k][j] = G[k][j] - acu;
			}
			
			for(int i=k+1; i<n ;i++) {
				acu = 0;
				for(int p=0; p<k ;p++) {
					acu = acu + (G[i][p] * G[p][k]);
				}
				G[i][k] = (G[i][k] - acu)/ G[k][k]; 
			}
		}
		
		mostrarMatrizAmpliada(G, n, n);
		
		//uso a x como auxiliar
		for(int f=0; f<n ;f++) {
			aux[f][0] = G[f][n];
		}
		
		//realizo Sustitucion regresiva
		x = resolucionSistTriangularSuperior(G, n, aux);
		
		return x;
	}
	//CRUT LU1
	public double[] croutLU1() {
		int n = this.orden[0],
			f, c;
		double x[] 	   = new double[n],
			   G[][]   = new double[n][n+1],
			   aux[][] = new double[n][1],
			   D[][]   = new double[n][n],
			   acu     = 0;
		
		//Copia A y B talque G = (A|b)
		G = getMatrizAmpliadaInterno(this.matrizCoef, n, n, this.termIndep);
		
		//Comienza el proceso de Factorización A = L1 * U
		for(int k=0; k<n ;k++) {
			for(int j=k; j<n ;j++) {
				acu = 0;
				for(int p=0; p<k ;p++) {
					acu = acu + (G[j][p] * G[p][k]);
				}
				G[j][k] = G[j][k] - acu;
			}
			
			for(int i=k+1; i<=n ;i++) {
				acu = 0;
				for(int p=0; p<k ;p++) {
					acu = acu + (G[k][p] * G[p][i]);
				}
				G[k][i] = (G[k][i] - acu)/ G[k][k]; 
			}
		}
		
		mostrarMatrizAmpliada(G, n, n);
		
		//uso aux como auxiliar
		for(f=0; f<n ;f++) {
			aux[f][0] = G[f][n];
		}
		
		//Construyo la matriz triangular superior para mandar a sust. regresiva
		for(f=0; f<n ;f++) {
			for(c=f; c<n ;c++) {
				if(f==c) {
					D[f][c] = 1;
				}else D[f][c] = G[f][c];
			}
			
		}
		
		//realizo Sustitucion regresiva
		x = resolucionSistTriangularSuperior(D, n, aux);
		
		return x;
	}
	
	//CHOLESKY: SOLO SE PUEDE APLICAR CHOLESKY SI ES SIMETRICA O DEF. POSITIVA
	private boolean esSimetrica() {
		boolean cumple = true;
		
		int i=0 , n = this.orden[0], j;
		while(i<n && cumple) {
			j=0;
			while(j<n && cumple) {
				if(i!=j) {
					if(this.matrizCoef[i][j] != this.matrizCoef[j][i]){
						cumple = false;
					}
				}
				j++;
			}
			i++;
		}
		
		return cumple;
	}
	private boolean esDefPositiva(double a[][], int n) {
		boolean cumple = true;
		int i=n-1;
		double det;
		if(a[0][0] <= 0) {
			cumple = false;
		}
		while(i>0 && cumple) {
			det = determinante(a,i,i,2,1);
			if(det <= 0) {
				cumple = false;
			}
			i--;
		}
		
		return cumple;
	}
	//CHOLESKY DONDE L ES LA TRASPUESTA DE U
	public double[] choleskyUtU() {
		int n = this.orden[0];
		double x[]     = new double[n],
			   U[][]   = new double[n][n+1],
			   aux[][] = new double[n][1];
		
		boolean simetrica = esSimetrica(), positiva = esDefPositiva(this.matrizCoef, n);
		
		if(simetrica && positiva) {
			//Copia A y B talque G = (A|b)
			U = getMatrizAmpliadaInterno(this.matrizCoef, n, n, this.termIndep);
			
			double acu = 0;
			
			//comienza el proceso de descomposición de A|b
			for(int k=0; k<n ;k++) {
				//para los elementos de la diagonal
				acu = 0;
				for(int p=k-1; p>=0 ;p--) {
					acu = acu + Math.pow(U[p][k], 2);
				}
				U[k][k] = Math.sqrt(U[k][k] - acu);
				
				//para los demás
				for(int j=k+1; j<=n ;j++) {
					acu = 0;
					for(int i=0; i<k ;i++) {
						acu = acu + (U[i][k]*U[i][j]);
					}
					U[k][j] = (U[k][j] - acu)/U[k][k];
					if(j!=n) U[j][k] = U[k][j];
				}
			}
			
			//uso a x como auxiliar
			for(int f=0; f<n ;f++) {
				aux[f][0] = U[f][n];
			}
			
			//realizo Sustitucion regresiva
			x = resolucionSistTriangularSuperior(U, n, aux);
			
			mostrarMatrizAmpliada(U, n,n);
			
		}else System.out.println("No cumple las condiciones del Método de Cholesky.");
		
		return x;
	}
	//CHOLESKY DONDE U ES LA TRASPUESTA DE L
	public double[] choleskyLLt() {
		int n = this.orden[0];
		double x[]     = new double[n],
			   L[][]   = new double[n+1][n],
			   aux[][] = new double[n][1];
		
		boolean simetrica = esSimetrica(), positiva = esDefPositiva(this.matrizCoef, n);
		
		if(simetrica && positiva) {
			double acu;
			
			//Copia A y B talque G = (A|b)
			L = getMatrizCoef();
			for(int c=0; c<n ;c++){
				L[n][c] = this.termIndep[c][0];
			}
			
			//comienza el proceso de descomposición de A|b
			for(int k=0; k<n ;k++) {
				//para los elementos de la diagonal
				acu = 0;
				for(int p=k-1; p>=0 ;p--) {
					acu = acu + Math.pow(L[k][p], 2);
				}
				L[k][k] = Math.sqrt(L[k][k] - acu);
				
				//para los demás
				for(int j=k+1; j<=n ;j++) {
					acu = 0;
					for(int i=0; i<k ;i++) {
						acu = acu + (L[k][i]*L[j][i]);
					}
					L[j][k] = (L[j][k] - acu)/L[k][k];
					if(j!=n) L[k][j] = L[j][k];
				}
			}
			
			//uso a x como auxiliar
			for(int c=0; c<n ;c++) {
				aux[c][0] = L[n][c];
			}
			
			//realizo Sustitucion regresiva
			x = resolucionSistTriangularSuperior(L, n, aux);
			
			mostrarMatrizAmpliada(L, n,n);
			
		}else System.out.println("No cumple las condiciones del Método de Cholesky.");
		
		return x;
	}
}
