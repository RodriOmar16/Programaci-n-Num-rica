
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
	
	public double[][] getMatrizAmpliada(){
		int n = this.orden[0], m = this.orden[1], f,c;
		double a[][] = new double[n][m+1];
		
		for(f=0; f<n ;f++) {
			for(c=0; c<m ;c++) {
				a[f][c] = this.matrizCoef[f][c]; 
			}
			a[f][0] = this.termIndep[f][0];
		}
		return a;
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
	
	public void mostrarMatriz(int opc) {
		int f,c,n ,m;
		switch(opc) {
			case 1: //matriz de coef
				n = this.orden[0]; m = this.orden[1];
				System.out.println("\nMuestra de la matriz de coeficientes: ");
				for(f=0; f<n ;f++) {
					System.out.println();
					for(c=0; c<m ;c++) {
						System.out.print(this.matrizCoef[f][c]+"\t");
					}
				}
				System.out.println("");
				break;
			case 2: //terminos indep 
				System.out.println("\nMuestra de los términos independientes: \n");
				n = this.orden[0];
				for(c=0; c<n ;c++) {
					System.out.println(""+this.termIndep[c][0]);
				}
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
	
	//Determinante de una matriz
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
	
	//Devuelve la n-upla solución del sistema
	public double[] resolucionSistDiagonal() {
		int n = this.orden[0];
		double x[] = new double[n];
		for(int i=0; i<n ;i++) {
			x[i] = this.termIndep[i][0]/this.matrizCoef[i][i];
		}
		return x;
	}
	
	//Devuelve la n-upla solución del Sistema Triangular superior
	public double[] resolucionSistTriangularSuperior(double A[][], int n, double b[][]) {
		//int n = this.orden[0];
		double x[] = new double[n];
		if(esTriangularSuperior(A, n, n)) {
			double acu = 0;
			x[n-1] = (b[n-1][0] - acu )/A[n-1][n-1];
			
			for(int f=n-2; f>=0 ;f--) {
				acu = 0; 
				for(int c=n-1; c>f ;c--) {
					acu = acu + A[f][c] * x[c];
				}
				x[f] = (b[f][0] - acu)/A[f][f];
			}			
			
		}else {
			System.out.println("El sistema no es triangular Superior.");
		}
		return x;
	}
	
	//Devuelve la n-upla solución del Sistema Triangular inferior
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
	
	//Factorización LU
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
	
	//realiza pivoteo normal 
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
		for(int f=0; f<n ;f++) {
			for(c=0; c<n ;c++){
				G[f][c] = this.matrizCoef[f][c];
			}
			G[f][c] = this.termIndep[f][0];
		}

		System.out.println("\n Muestra de la G Gauss");
		for(int f=0; f<n ;f++) {
			System.out.println("");
			for(c=0; c<n ;c++){
				System.out.print(G[f][c]+"\t");
				//G[f][c] = this.matrizCoef[f][c];
			}
			System.out.print(" | "+G[f][c]);
			//G[f][c] = this.termIndep[f][0];
		}
		
		
		//Comienza la eliminación
		for(int k=0; k<n-1 ;k++) {
			//realizo privoteo de ser necesario
			if(G[k][k] == 0){
				G = pivotearNormal(G,n,n+1, k);
			}
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
		
		return x;
	}
	
	//GAUSS-JORDAN
	public double[] gaussJordan(){
		int n = this.orden[0], c;
		double x[] = new double[n], 
				G[][] = new double[n][n+1],m;
		
		//Copia A y B talque G = (A|b)
		for(int f=0; f<n ;f++) {
			for(c=0; c<n ;c++){
				G[f][c] = this.matrizCoef[f][c];
			}
			G[f][c] = this.termIndep[f][0];
		}
		//G = getMatrizAmpliada();
				
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
		return x;
	}
	
	//CRUT L1U
	
	
	//CRUT LU1
	
	//CHOLESKY: SOLO SE PUEDE APLICAR CHOLESKY SI ES SIMETRICA O DEF. POSITIVA
	
}
